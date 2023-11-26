import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'node:path';
import { Project } from 'ts-morph';
import { InterfaceParser } from './classes/interface-parser';
import { TemplateDataGenerator } from './classes/template-data-generator';
import { createOrCheckDir } from './utils/file.helper';

const serviceTemplate = Handlebars.compile(
    readFileSync(join('api-generator', 'templates', 'angular-service.handlebars'), { encoding: 'utf-8' })
);

/**
 * @param rootPath The root directory path where the API files are located
 * @param outputPath The folder name to generate the services in
 * */
export async function generateApi(rootPath: string, outputPath: string): Promise<void> {
    // apis folder
    const endpointsPath = join(rootPath, 'endpoints');
    await createOrCheckDir(endpointsPath);

    // output folder
    outputPath = join(rootPath, outputPath);
    await createOrCheckDir(outputPath);

    // ts parser
    const tsParser = new Project();
    tsParser.addSourceFilesAtPaths(`${endpointsPath}/**/[!_]*`);

    // parse each api models file
    const sourceFiles = tsParser.getSourceFiles();
    for (const sourceFile of sourceFiles) {
        const fileName = sourceFile.getBaseName();
        console.log(fileName);
        console.log('-------------------------');

        const interfaceParser = new InterfaceParser(rootPath, sourceFile);
        await generateApiService(outputPath, fileName, interfaceParser);

        console.log();
    }
}

async function generateApiService(outputPath: string, fileName: string, interfaceParser: InterfaceParser): Promise<void> {
    const importedItems = interfaceParser.interfaces.map(data => data.name).join(', ');
    const importsPath = fileName.replace('.ts', '');

    const templateData = TemplateDataGenerator.getAngularTemplateData(fileName, interfaceParser.interfaces);

    const data = serviceTemplate({
        serviceName: templateData.serviceName,
        apis: templateData.data,
        importedItems,
        importsPath,
        imports: Array.from(interfaceParser.importsMap.entries(), ([path, models]) => {
            return [Array.from(models.values()).join(', '), path];
        })
    });
    await writeFile(join(outputPath, templateData.serviceFileName), data, { encoding: 'utf-8' });
}
