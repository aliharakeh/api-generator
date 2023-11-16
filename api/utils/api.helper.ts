import { Project, Type } from 'ts-morph';
import * as url from 'url';

/** The interface of the extracted regex data */
export interface ParsedApiModel {
    /** Interface name */
    name: string;
    /** HTTP method */
    method: string;
    /** API Url */
    url: string;
    /** API Response Type */
    responseType: string;
}

const responseTypeRegex = /^import\(.+?\)\.(.*)$/;

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
        const method = interfaceDeclaration.getHeritageClauses()[0].getText().replace('extends', '').trim();
        const fields: Fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType();
            return acc;
        }, {});

        let baseUrl = '';
        const responseType = fields['response'].getText().replace(responseTypeRegex, '$1');
        const url = fields['url'].getLiteralValue() as string;

        console.log(`[${method}] ${name}: ${responseType} --> ${baseUrl}${url}`);

        return {
            name,
            method: method.toLowerCase(),
            url,
            responseType
        };
    });
}

/**
 * @param regexData The extracted regex data
 * */
export function getApiRequestArgs({ name, method, url, responseType }: ParsedApiModel) {
    const params = `params?: ${name}['params']`;
    const data = method === 'GET' ? '' : `, data?: ${name}['data']`;
    return {
        url,
        name,
        responseType,
        method: method.toLowerCase(),
        args: params + data
    };
}
