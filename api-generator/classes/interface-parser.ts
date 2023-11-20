import { HeritageClause, InterfaceDeclaration, Project, Type } from 'ts-morph';


const IMPORT_REGEX = /import\(["'](.*?)["']\)\.(\w+(?:<\w+>)?)/g;
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
    public importsMap = new Map<string, Map<string, Set<string>>>();
    private project: Project;
    private currentSourceFile = null;

    constructor(private rootPath: string) {
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
            this.currentSourceFile = fileName;
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
            return this.parseImportPaths(typeText).reverse().reduce((acc, model, i) => {
                return i == 0 ? model : `${model}<${acc}>`;
            }, '');
        }
        return typeText;
    }

    parseImportPaths(typeText: string) {
        let models = [];
        let matches = typeText.matchAll(IMPORT_REGEX);
        for (let match of matches) {
            const [importPath, model] = match.slice(1, 3);
            // TODO: each sourceFile must have an object containing import path with model name
            if (!this.importsMap.has(this.currentSourceFile)) {
                const map = new Map();
                map.
                this.importsMap.set(this.currentSourceFile, );
            }
            const importItems = this.importsMap.get(this.currentSourceFile) || new Map();
            const path = this.cleanImportPath(importPath);
            const imports = importItems.get(path) || new Set();
            imports.add(model)
            models.push(model);
        }
        return models;
    }

    getImports(sourceFile: string) {
        return [...this.importsMap.get(sourceFile).keys()];
    }

    cleanImportPath(path: string) {
        // TODO: clean the path and only keep the file name to reference it from the models folder in the template
        return path;
    }
}
