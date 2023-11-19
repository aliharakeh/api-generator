import { lstat, mkdir, readdir } from 'fs/promises';

export async function createOrCheckDir(path: string) {
    try {
        await lstat(path);
    }
    catch (e) {
        await mkdir(path);
    }
}

export async function getApiModels(modelsPath: string) {
    const files = await readdir(modelsPath);
    return files.filter(f => !f.startsWith('_'));
}
