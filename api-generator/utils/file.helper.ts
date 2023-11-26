import { lstat, mkdir } from 'fs/promises';

export async function createOrCheckDir(path: string) {
    try {
        await lstat(path);
    }
    catch (e) {
        await mkdir(path);
    }
}
