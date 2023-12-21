import { lstat, mkdir } from 'fs/promises';

/**
 * Checks if a directory exists at the specified path, and creates it if it doesn't exist.
 */
export async function createOrCheckDir(path: string) {
    try {
        await lstat(path);
    }
    catch (e) {
        await mkdir(path);
    }
}
