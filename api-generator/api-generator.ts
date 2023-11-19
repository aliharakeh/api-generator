import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'node:path';
import { InterfaceParser, ParsedApiModel } from './classes/interface-parser';
import { TemplateDataGenerator } from './classes/template-data-generator';
import { createOrCheckDir, getApiModels } from './utils/file.helper';

const serviceTemplate = Handlebars.compile(
    readFileSync(join('api-generator', 'templates', 'angular-service.handlebars'), { encoding: 'utf-8' })
);

/**
 * @param rootPath The root directory path where the API files are located
 * @param outputPath The folder name to generate the services in
 * */
export async function generateApi(rootPath: string, outputPath: string): Promise<void> {
    const endpointsPath = join(rootPath, 'endpoints');
    await createOrCheckDir(endpointsPath);

    outputPath = join(rootPath, outputPath);
    await createOrCheckDir(outputPath);

    const apiFiles = await getApiModels(endpointsPath);
    const interfaceParser = new InterfaceParser();
    apiFiles.forEach(file => interfaceParser.addFile(join(endpointsPath, file)));
    const interfaces = interfaceParser.getInterfaces();
    for (const sourceFile of Object.keys(interfaces)) {
        await generateApiService(outputPath, sourceFile, interfaces[sourceFile]);
    }
}

/**
 * @param outputPath The path to save the API service to.
 * @param apiFile The name of the import file.
 * @param apis An array of objects containing interface data
 * */
async function generateApiService(outputPath: string, apiFile: string, apis: ParsedApiModel[]): Promise<void> {
    const importedItems = apis.map(data => data.name).join(', ');
    const importsPath = apiFile.replace('.ts', '');

    const templateData = TemplateDataGenerator.getAngularTemplateData(apiFile, apis);

    const data = serviceTemplate({
        serviceName: templateData.serviceName,
        apis: templateData.data,
        importedItems,
        importsPath
    });
    await writeFile(join(outputPath, templateData.serviceFileName), data, { encoding: 'utf-8' });
}
