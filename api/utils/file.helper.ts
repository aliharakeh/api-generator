import { lstat, mkdir, readdir } from 'fs/promises';

export async function createOrCheckDir(path: string) {
    try {
        await lstat(path);
    }
    catch (e) {
        await mkdir(path);
    }
}

export async function getApiFiles(modelsPath: string) {
    const files = await readdir(modelsPath);
    return files.filter(f => !f.startsWith('_'));
}

/**
 * @param apiFile The name to the API file.
 * */
export function getAngularServicePath(apiFile: string): string {
    return apiFile.replace(/(\.models?)?\.ts/i, '.api.service.ts');
}
