var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { compile } from 'handlebars';
import { join } from 'node:path';
import { Project } from 'ts-morph';
import { InterfaceParser } from './classes/interface-parser';
import { TemplateDataGenerator } from './classes/template-data-generator';
import { createOrCheckDir } from './utils/file.helper';
const ENDPOINTS_PATH = 'endpoints';
const MODELS_PATH = 'models';
const OUTPUT_PATH = 'services';
const serviceTemplate = compile(readFileSync(join('api-generator', 'templates', 'angular-service.handlebars'), { encoding: 'utf-8' }));
/**
 * Generates the APIs based on the given root path and output path.
 */
export function generateApi(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // apis folder
        const endpointsPath = join(rootPath, ENDPOINTS_PATH);
        yield createOrCheckDir(endpointsPath);
        // output folder
        const outputPath = join(rootPath, OUTPUT_PATH);
        yield createOrCheckDir(outputPath);
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
            yield generateApiService(outputPath, fileName, interfaceParser);
            console.log();
        }
    });
}
/**
 * Generates an API service file based on the given output path, file name, and interface parser.
 */
function generateApiService(outputPath, fileName, interfaceParser) {
    return __awaiter(this, void 0, void 0, function* () {
        const importedApis = interfaceParser.interfaces.map(data => data.name).join(', ');
        const importsApisPath = `../${ENDPOINTS_PATH}/${fileName.replace('.ts', '')}`;
        const templateData = TemplateDataGenerator.getAngularTemplateData(fileName, interfaceParser.interfaces);
        const data = serviceTemplate(Object.assign(Object.assign({}, templateData), { importedApis,
            importsApisPath, modelsImports: interfaceParser.getModelsImports() }));
        yield writeFile(join(outputPath, templateData.serviceFileName), data, { encoding: 'utf-8' });
    });
}
