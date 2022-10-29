import * as Process from './process_glue'
import * as path from 'path';
export async function getAbsolute(p: string): Promise<string> {
    if (p.startsWith('/')) return p;
    return path.resolve(await Process.getWorkdir(), p)
}
export function isFilePath(p: string) {
    return /^((\.+)|\/)/.test(p);
}