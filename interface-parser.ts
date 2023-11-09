import { join } from 'node:path';
import { Project, PropertySignature, SyntaxKind } from 'ts-morph';

/** The interface of the extracted regex data */
interface InterfaceParsedData {
    /** Interface name */
    name: string;
    /** HTTP method */
    method: string;
    /** API Url */
    url: string;
}

export function geInterfaceParsedData(): InterfaceParsedData[] {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(join(__dirname, 'api', 'setA.ts'));

    const interfaces = sourceFile.getInterfaces();
    return interfaces.map(interfaceDeclaration => {
        const name = interfaceDeclaration.getName();
        const method = interfaceDeclaration.getHeritageClauses()[0].getText().replace('extends', '').trim().toLowerCase();
        const fields = interfaceDeclaration.getProperties().reduce((acc, prop) => {
            acc[prop.getName()] = prop.getType().getLiteralValue();
            return acc;
        }, {});
        extractNestedProperties(interfaceDeclaration.getProperties());
        const res = { name, method, url: fields['url'] };
        return res;
    });
}

function extractNestedProperties(properties: PropertySignature[], prefix = ''): any[] {
    let nestedProperties: any[] = [];

    properties.forEach(property => {
        const propertyName = property.getName();
        const propertyType = property.getType();

        if (propertyType.isObject()) {
            const nestedProperties = propertyType.getProperties();
            nestedProperties.forEach(nestedProperty => {
                const nestedPropertyName = nestedProperty.getName();
                const nestedPropertyType = nestedProperty.getDeclaredType();

                console.log(`Nested Property: ${propertyName}.${nestedPropertyName}, Type: ${nestedPropertyType.getText()}`);
            });
        }

        nestedProperties.push({
            property: prefix + propertyName,
            type: propertyType,
        });
    });

    return nestedProperties;
}

// console.log(geInterfaceParsedData());
geInterfaceParsedData()
