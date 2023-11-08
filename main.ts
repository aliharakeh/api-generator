import { readdir, readFile, writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { join } from 'node:path';
import Handlebars from "handlebars";

const importTemplate = Handlebars.compile(`import \{ {{imports}} \} from './{{importPath}}';\n\n`);
const serviceTemplate = Handlebars.compile(readFileSync('api/angular-service.handlebars', { encoding: 'utf-8'}));

/**
 * A regex that will parse a typescript interface ans extract the interface name, extended interface name, and the url property defined
 * explanation:
 * | interface, extends | exact words match |
 * ------------|------------------
 * | [\s\t\n\r]+, [\s\t\n\r]* | any kind of spacing |
 * ------------|------------------
 * | { | open curly braces |
 * ------------|------------------
 * */
const interfacePattern = /interface[\s\t\n\r]+(\w+)[\s\t\n\r]+extends[\s\t\n\r]+(\w+)[\s\t\n\r]*\{[\s\t\n\r]*url[\s\t\n\r]*:[\s\t\n\r]*'(.+?)'[\s\t\n\r]*/g;

/** The interface of the extracted regex data */
interface RegexData {
    /** Interface name */
    name: string;
    /** HTTP method */
    method: string;
    /** API Url */
    url: string;
}

/**
 * @param rootPath The root directory path where the API files are located
 * */
async function generateApi(rootPath: string): Promise<void> {
    const files = await readdir(rootPath);
    for (const file of files) {
        if (file.endsWith('.ts') && !['utils.ts', '-api.ts'].some(s => file.endsWith(s))) {
            const apiFile = join(rootPath, file);
            const regexData = await getAllInterfaces(apiFile);
            await generateApiFile(apiFile, file, regexData);
        }
    }
}

/**
 * @param filePath The path to the API file.
 * */
async function getAllInterfaces(filePath: string): Promise<RegexData[]> {
    const content = await readFile(filePath, { encoding: 'utf-8' });
    return [...content.matchAll(interfacePattern)].map(data => {
        return {
            name: data[1],
            method: data[2],
            url: data[3]
        };
    });
}

/**
 * @param apiFile The path to the API file.
 * @param importFile The name of the import file.
 * @param regexData An array of objects containing regex data, with each object having the properties name, method, and url.
 * */
async function generateApiFile(apiFile: string, importFile: string, regexData: RegexData[]): Promise<void> {
    const imports = regexData.map(data => data.name).join(', ');
    const importPath = importFile.replace('.ts', '');
    let res = [];
    const outputName = generateApiFileName(apiFile);
    for (let data of regexData) {
        res.push(generateApiFunction(data));
    }
    const data = importTemplate({ imports, importPath }) +  serviceTemplate({ api: res });
    await writeFile(outputName, data, { encoding: 'utf-8' });
}

/**
 * @param apiFile The path to the API file.
 * */
function generateApiFileName(apiFile: string): string {
    return apiFile.replace('.ts', '-api.ts');
}

/**
 * @param regexData The extracted regex data
 * */
function generateApiFunction({ name, method, url }: RegexData) {
    const params = `params?: ${name}['params']`;
    const data = method === 'GET' ? '' : `, data?: ${name}['data']`;
    return {
        url,
        name,
        method: method.toLowerCase(),
        args: params + data
    };
}

generateApi('api');
