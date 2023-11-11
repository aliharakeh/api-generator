import { Project, ts, Type } from 'ts-morph';

/** The interface of the extracted regex data */
export interface InterfaceParsedData {
    /** Interface name */
    name: string;
    /** HTTP method */
    method: string;
    /** API Url */
    url: string;
    /** API Response Type */
    responseType: string;
}

const responseTypeRexe = /^import\(.+?\)\.(.*)$/;

interface Fields {
    [name: string]:  Type;
}

export function geInterfaceParsedData(path: string): InterfaceParsedData[] {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(path);


    const interfaces = sourceFile.getInterfaces();
    return interfaces.map(interfaceDeclaration => {
        const name = interfaceDeclaration.getName();
        const method = interfaceDeclaration.getHeritageClauses()[0].getText().replace('extends', '').trim().toLowerCase();
        const fields: Fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType();
            return acc;
        }, {});
        return {
            name,
            method,
            url: fields['url'].getLiteralValue() as string,
            responseType: fields['response'].getText().replace(responseTypeRexe, '$1')
        };
    });
}
