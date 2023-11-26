import { HeritageClause, InterfaceDeclaration, Project, SourceFile, Type } from 'ts-morph';
import { ImportPathParser } from './import-path-parser';


const METHOD_PATTERN = /^extends\s+(\w+)<(.*)>$/;
const REQUIRED_FIELDS = ['endpoint'];

export interface Fields {
    endpoint: Type;
    params?: Type;
    data?: Type;
    response?: Type;
}

export interface ParsedApiModel {
    name: string;
    method: string;
    baseUrl: string;
    endpoint: string;
    responseType: string;
}

export class InterfaceParser {
    public importsMap = new Map<string, Set<string>>();
    public interfaces: ParsedApiModel[];

    constructor(private rootPath: string, private sourceFile: SourceFile) {
        // parse interfaces
        this.interfaces = sourceFile.getInterfaces().map(i => this.parseInterface(i));
    }

    parseInterface(interfaceDeclaration: InterfaceDeclaration): ParsedApiModel {
        // extract interface data
        const name = interfaceDeclaration.getName();
        const fields: Fields = this.parseFields(interfaceDeclaration);
        const [method, baseUrl] = this.parseMethodAndBaseUrl(interfaceDeclaration.getHeritageClauses(), fields);
        const responseType = this.parseResponse(fields);
        const endpoint = fields.endpoint.getLiteralValue() as string;

        console.log(`[${method}] ${name}: ${responseType} --> ${baseUrl} (${endpoint})`);

        return {
            name,
            method,
            baseUrl,
            endpoint,
            responseType
        };
    }

    parseFields(interfaceDeclaration: InterfaceDeclaration) {
        // get properties
        const fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType();
            return acc;
        }, {} as Fields);

        // check for required fields
        let errors = false;
        REQUIRED_FIELDS.forEach(fieldName => {
            if (!fields.hasOwnProperty(fieldName)) {
                errors = true;
                console.log(`[REQUIRED] ${fieldName} field is required!`);
            }
        });
        if (errors) {
            throw new Error('[ERROR] The above fields are required!');
        }

        return fields;
    }

    parseMethodAndBaseUrl(heritageClauses: HeritageClause[], fields: Fields) {
        // check if interface extends any HTTP method
        if (!heritageClauses?.length) {
            throw new Error('[REQUIRED] Api Interface should extends the Method Type & Base Url! ex: extends GET<APIs.BASE>, extends POST<APIs.BASE>\n');
        }

        // extract method and base url
        let [method, baseUrl] = heritageClauses[0].getText().match(METHOD_PATTERN).slice(1, 3);
        method = method.toLowerCase();
        if (method === 'post' && !fields.data) {
            throw new Error('[REQUIRED] The API is using POST method while missing the data field!');
        }

        return [method, baseUrl];
    }

    parseResponse(fields: Fields) {
        // check response field
        if (!fields.response) {
            return 'ApiResponse<any>';
        }

        // parse response
        const response = fields.response.getText();
        const importPathParser = new ImportPathParser(this.rootPath, response);

        // add any new imports to imports map
        this.updateImportsMap(importPathParser.importMap);

        return importPathParser.model;
    }

    updateImportsMap(importMap: Map<string, Set<string>>) {
        for (const [path, models] of importMap.entries()) {
            let mapItem = this.importsMap.get(path);
            if (mapItem) {
                [...models.values()].forEach(v => mapItem.add(v));
            }
            else {
                this.importsMap.set(path, models);
            }
        }
    }
}
