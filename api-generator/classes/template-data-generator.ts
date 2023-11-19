import { ParsedApiModel } from './interface-parser';

export class TemplateDataGenerator {

    static getAngularTemplateData(apiFile: string, apiModels: ParsedApiModel[]) {
        const serviceName = apiFile.replace(/(\.models?)?\.ts/i, '');
        return {
            serviceName: serviceName[0].toUpperCase() + serviceName.slice(1) + 'ApiService',
            serviceFileName: apiFile.replace(/(\.models?)?\.ts/i, '.api.service.ts'),
            data: apiModels.map(apiModel => {
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
