import { Project, Type } from 'ts-morph';

/** The interface of the extracted regex data */
export interface ParsedApiModel {
    /** Interface name */
    name: string;
    /** HTTP method */
    method: string;
    /** API Base Url */
    baseUrl: string;
    /** API Url */
    endpoint: string;
    /** API Response Type */
    responseType: string;
}

const responseTypeRegex = /^import\(.+?\)\.(.*)$/;
const methodPattern = /extends\s+(\w+)<(.*)>/;

interface Fields {
    [name: string]: Type;
}

export function getApiInterfaces(path: string): ParsedApiModel[] {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(path);
    const interfaces = sourceFile.getInterfaces();

    console.log(path);
    console.log('-------------------------');

    return interfaces.map(interfaceDeclaration => {
        const name = interfaceDeclaration.getName();
        const [method, baseUrl] = interfaceDeclaration.getHeritageClauses()[0].getText().replace(methodPattern, '$1 $2').split(' ');
        const fields: Fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType();
            return acc;
        }, {});

        console.log(fields);

        const responseType = fields['response'].getText().replace(responseTypeRegex, '$1');
        const endpoint = fields['endpoint'].getLiteralValue() as string;

        console.log(`[${method}] ${name}: ${responseType} --> ${baseUrl} (${endpoint})`);

        return getApiRequestArgs({
            name,
            method,
            baseUrl,
            endpoint,
            responseType
        });
    });
}

/**
 * @param regexData The extracted regex data
 * */
export function getApiRequestArgs({ name, method, baseUrl, endpoint, responseType }: ParsedApiModel) {
    const params = `params?: ${name}['params']`;
    const data = method === 'GET' ? '' : `, data?: ${name}['data']`;
    return {
        baseUrl,
        endpoint,
        name,
        responseType,
        method: method.toLowerCase(),
        args: params + data
    };
}
