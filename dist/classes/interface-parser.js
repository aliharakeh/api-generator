import { ImportPathParser } from './import-path-parser';
const METHOD_PATTERN = /^extends\s+(\w+)<(.*)>$/;
const REQUIRED_FIELDS = ['endpoint'];
const EXCLUDED_MODELS = ['ApiResponse', 'HttpOptions', 'APIs'];
export class InterfaceParser {
    constructor(rootPath, sourceFile) {
        this.rootPath = rootPath;
        this.sourceFile = sourceFile;
        this.importsMap = new Map();
        // parse interfaces
        this.interfaces = sourceFile.getInterfaces().map(i => this.parseInterface(i));
    }
    parseInterface(interfaceDeclaration) {
        // extract interface data
        const name = interfaceDeclaration.getName();
        const fields = this.parseFields(interfaceDeclaration);
        const [method, baseUrl] = this.parseMethodAndBaseUrl(interfaceDeclaration.getHeritageClauses(), fields);
        const responseType = this.parseResponse(fields);
        const endpoint = fields.endpoint.getLiteralValue();
        console.log(`[${method}] ${name}: ${responseType} --> ${baseUrl} (/${endpoint})`);
        return {
            name,
            method,
            baseUrl,
            endpoint,
            responseType
        };
    }
    parseFields(interfaceDeclaration) {
        // get properties
        const fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType();
            return acc;
        }, {});
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
    parseMethodAndBaseUrl(heritageClauses, fields) {
        // check if interface extends any HTTP method
        if (!(heritageClauses === null || heritageClauses === void 0 ? void 0 : heritageClauses.length)) {
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
    parseResponse(fields) {
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
    updateImportsMap(importMap) {
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
    getModelsImports() {
        return [...this.importsMap.entries()]
            // exclude already imported base api models
            .map(([path, models]) => {
            const filteredModels = [...models.values()].filter(m => !EXCLUDED_MODELS.some(excluded => m.includes(excluded)));
            return [path, filteredModels];
        })
            // filter empty models
            .filter(([_, models]) => models.length > 0)
            // format models imports
            .map(([path, models]) => {
            return {
                // filter inner model's type
                models: models.map(m => m.split('<')[0]).join(', '),
                path: `../${path}`
            };
        });
    }
}
