import * as process from "./process_glue";
import * as fs from './fs'
import * as npath from 'path';
export default async function findCommand(cmd: string) {
    const path = (await process.environ.get("PATH")).split(':');
    for (let folder of path) {
        if (!await fs.exists(folder)) continue;
        if (!(await fs.stat(folder)).isDirectory) continue;
        const folderfiles = await fs.readdir(folder);
        if (!folderfiles.includes(cmd)) continue;
        return npath.resolve(folder, cmd);
    }
    return null;
}