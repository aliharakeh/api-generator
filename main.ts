import { readdir, readFile, writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { join } from 'node:path';
import Handlebars from "handlebars";
import { geInterfaceParsedData,InterfaceParsedData } from './interface-parser';

const importTemplate = Handlebars.compile(`import \{ {{imports}} \} from './{{importPath}}';\n\n`);
const serviceTemplate = Handlebars.compile(readFileSync('api/angular-service.handlebars', { encoding: 'utf-8'}));



/**
 * @param rootPath The root directory path where the API files are located
 * */
async function generateApi(rootPath: string): Promise<void> {
    const files = await readdir(rootPath);
    for (const file of files) {
        if (file.endsWith('.ts') && !['utils.ts', '-api.ts'].some(s => file.endsWith(s))) {
            const apiFile = join(rootPath, file);
            const regexData = geInterfaceParsedData(apiFile);
            await generateApiFile(apiFile, file, regexData);
        }
    }
}

/**
 * @param apiFile The path to the API file.
 * @param importFile The name of the import file.
 * @param interfaceParsedData An array of objects containing interface data
 * */
async function generateApiFile(apiFile: string, importFile: string, interfaceParsedData: InterfaceParsedData[]): Promise<void> {
    const imports = interfaceParsedData.map(data => data.name).join(', ');
    const importPath = importFile.replace('.ts', '');
    let res = [];
    const outputName = generateApiFileName(apiFile);
    for (let data of interfaceParsedData) {
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
function generateApiFunction({ name, method, url, responseType }: InterfaceParsedData) {
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

generateApi('api');
