import parse from "bash-parser";
import * as process from "./process_glue";
import * as util from './util';
import * as fs from './fs';
import findCommand from './command_locations';
import * as terminal from './terminal'
export function parseWord(word: any): string {
    return word.text;
}
export default async function run(src: string) {
    if (!src) return
    const ast = parse(src);
    let env = await api.environ.list();
    for (let command of ast.commands) {
        switch (command.type) {
            case "Command": {
                const name = parseWord(command.name);
                console.log(command)
                const args = (command.suffix || []).map((x:any) => parseWord(x));
                if (util.isFilePath(name)) {
                    if (!await fs.exists(await util.getAbsolute(name))) {
                        terminal.log(`${name} not found.`);
                        break;
                    }
                    const pid = await process.mkproc(name, args, {environ: env});
                    await api.proc.wait(pid);
                    break;
                }
                const filePath = await findCommand(name+'.js');
                if (!filePath) {
                    terminal.log('Command not found: ' + name);
                    break;
                }
                const pid = await process.mkproc(filePath, args, {environ: env});
                await api.proc.wait(pid);
                break;
            }
        }
    }
}