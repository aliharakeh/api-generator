import { HeritageClause, InterfaceDeclaration, Project, Type } from 'ts-morph';


const IMPORT_REGEX = /^import\((.+?)\)\.(.*)$/;
const METHOD_PATTERN = /^extends\s+(\w+)<(.*)>$/;
const REQUIRED_FIELDS = ['endpoint'];

export interface ParsedInterfaces {
    [key: string]: ParsedApiModel[];
}

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
    project: Project;
    importsMap = new Map<string, string[]>();

    constructor() {
        this.project = new Project();
    }

    addFile(path: string) {
        this.project.addSourceFileAtPath(path);
    }

    getInterfaces(): ParsedInterfaces {
        const sourceFiles = this.project.getSourceFiles();
        const interfaces = {};
        for (const file of sourceFiles) {
            const fileName = file.getBaseName();
            console.log(fileName);
            console.log('-------------------------');
            interfaces[fileName] = file.getInterfaces().map(int => this.parseInterface(int));
            console.log();
        }
        return interfaces;
    }

    parseInterface(interfaceDeclaration: InterfaceDeclaration): ParsedApiModel {
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
        const fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType();
            return acc;
        }, {} as Fields);
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
        if (!heritageClauses?.length) {
            throw new Error('[REQUIRED] Api Interface should extends the Method Type & Base Url! ex: extends GET<APIs.BASE>, extends POST<APIs.BASE>\n');
        }
        let [method, baseUrl] = heritageClauses[0].getText().match(METHOD_PATTERN).slice(1, 3);
        method = method.toLowerCase();
        if (method === 'post' && !fields.data) {
            throw new Error('[REQUIRED] The API is using POST method while missing the data field!');
        }
        return [method, baseUrl];
    }

    parseResponse(fields: Fields) {
        if (!fields.response) {
            return 'ApiResponse<any>';
        }
        const response = fields.response.getText();
        return this.parseTypeText(response);
    }

    parseTypeText(typeText: string) {
        if (typeText.startsWith('import')) {
            const [path, value] = typeText.match(IMPORT_REGEX).slice(1, 3);
            const importItems = this.importsMap.get(path) || [];
            this.importsMap.set(path, importItems.concat(value));
            return value;
        }
        return typeText;
    }
}
