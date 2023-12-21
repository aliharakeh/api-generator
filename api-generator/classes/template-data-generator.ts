import { ParsedApiModel } from './interface-parser';

export class TemplateDataGenerator {

    /**
     * Generates the Angular template data for a given API file and API models.
     */
    static getAngularTemplateData(apiFile: string, apiModels: ParsedApiModel[]) {
        const serviceName = apiFile.replace(/(\.models?)?\.ts/i, '');
        return {
            serviceName: serviceName[0].toUpperCase() + serviceName.slice(1) + 'ApiService',
            serviceFileName: apiFile.replace(/(\.models?)?\.ts/i, '.api.service.ts'),
            apis: apiModels.map(apiModel => {
                const params = `params?: ${apiModel.name}['params']`;
                const data = apiModel.method === 'get' ? '' : `, data?: ${apiModel.name}['data']`;
                return {
                    ...apiModel,
                    args: params + data
                };
            })
        };
    }
}
