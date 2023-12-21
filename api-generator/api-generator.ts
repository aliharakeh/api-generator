import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { join } from 'node:path';
import { Project } from 'ts-morph';
import { InterfaceParser } from './classes/interface-parser';
import { TemplateDataGenerator } from './classes/template-data-generator';
import { createOrCheckDir } from './utils/file.helper';

const ENDPOINTS_PATH = 'endpoints';
const MODELS_PATH = 'models';
const OUTPUT_PATH = 'services';

const serviceTemplate = Handlebars.compile(
    readFileSync(join('api-generator', 'templates', 'angular-service.handlebars'), { encoding: 'utf-8' })
);

/**
 * Generates the APIs based on the given root path and output path.
 */
export async function generateApi(rootPath: string): Promise<void> {
    // apis folder
    const endpointsPath = join(rootPath, ENDPOINTS_PATH);
    await createOrCheckDir(endpointsPath);

    // output folder
    const outputPath = join(rootPath, OUTPUT_PATH);
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

/**
 * Generates an API service file based on the given output path, file name, and interface parser.
 */
async function generateApiService(outputPath: string, fileName: string, interfaceParser: InterfaceParser): Promise<void> {
    const importedApis = interfaceParser.interfaces.map(data => data.name).join(', ');
    const importsApisPath = `../${ENDPOINTS_PATH}/${fileName.replace('.ts', '')}`;

    const templateData = TemplateDataGenerator.getAngularTemplateData(fileName, interfaceParser.interfaces);

    const data = serviceTemplate({
        ...templateData,
        importedApis,
        importsApisPath,
        modelsImports: interfaceParser.getModelsImports()
    });
    await writeFile(join(outputPath, templateData.serviceFileName), data, { encoding: 'utf-8' });
}
