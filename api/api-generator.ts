import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'node:path';
import { getApiInterfaces, ParsedApiModel } from './utils/api.extracter';
import { createOrCheckDir, getAngularServicePath, getApiFiles } from './utils/file.helper';

const serviceTemplate = Handlebars.compile(
    readFileSync(join('api', 'templates', 'angular-service.handlebars'), { encoding: 'utf-8' })
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

    const apiFiles = await getApiFiles(endpointsPath);
    for (const apiFile of apiFiles) {
        const apiModels = getApiInterfaces(join(endpointsPath, apiFile));
        await generateApiService(outputPath, apiFile, apiModels);
        if (apiFiles.length > 1) {
            console.log('\n\n');
        }
    }
}

/**
 * @param outputPath The path to save the API service to.
 * @param importFile The name of the import file.
 * @param apis An array of objects containing interface data
 * */
async function generateApiService(outputPath: string, importFile: string, apis: ParsedApiModel[]): Promise<void> {
    const importedItems = apis.map(data => data.name).join(', ');
    const importsPath = importFile.replace('.ts', '');

    const serviceFileName = getAngularServicePath(importFile);

    const data = serviceTemplate({ apis, importedItems, importsPath });
    await writeFile(join(outputPath, serviceFileName), data, { encoding: 'utf-8' });
}
