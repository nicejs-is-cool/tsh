import parse from "bash-parser";
import * as process from "./process_glue";
import * as util from './util';
import * as fs from './fs';
import findCommand from './command_locations';
import * as terminal from './terminal'
import * as InternalCommands from './commands';
import traverse from 'bash-ast-traverser';
import * as assert from "assert";

const Commands: { [key: string]: Function } = InternalCommands;

/*export function parseWord(word: any): string {
    return word.text;
}
export async function runCommand(env: { [key: string]: string }, command: any) {
    const name = parseWord(command.name);
    console.log(command)
    //const args = (command.suffix || [])
    //    .map((x:any) => parseWord(x));
    let args: string[] = [];
    let fd_map: {[key: number]: number} = {}
    let file_fd: number | null = null;
    for (let suf of (command.suffix || [])) {
        if (suf.type === "Word") {
            args.push(suf.text);
            continue;
        }
        if (suf.type === "Redirect") {
            if (suf.op.type === "great") {
                file_fd = await fs.open(await util.getAbsolute(suf.file.text), "w");
            } else {
                let file_data = await fs.readFile(await util.getAbsolute(suf.file.text));
                file_fd = await fs.open(await util.getAbsolute(suf.file.text), "w");
                await fs.write(file_fd, file_data);
            }
            fd_map[1] = file_fd; // moment
        }
    }
    if (command.prefix) {
        for (let cpref of command.prefix) {
            if (cpref.type === "AssignmentWord") {
                console.log(cpref);
                const [name, val] = cpref.text.split('=');
                env[name] = val;
            }
        }
    }
    if (util.isFilePath(name)) {
        if (!await fs.exists(await util.getAbsolute(name))) {
            terminal.log(`${name} not found.`);
            return;
        }
        const pid = await process.mkproc(name, [name, ...args], {environ: env, fd_map});
        await api.proc.wait(pid);
        return;
    }
    if (Commands[name]) {
        // internal command moment
        await Commands[name]({}, args);
        return;
    }
    const filePath = await findCommand(name+'.js');
    if (!filePath) {
        terminal.log('Command not found: ' + name);
        return;
    }
    const pid = await process.mkproc(filePath, [name, ...args], {environ: env, fd_map});
    await api.proc.wait(pid);
    if (file_fd) await fs.close(file_fd).catch(console.error) // just in case
    return;
}*/
export function runAST(ast: any) {
    traverse(ast, {
        Command(node: any) {
            if (node.name.text !== '') {
                const expectAliasCheck =
                    node.name.maybeSimpleCommandName ||
                    node.name.text.indexOf('$') !== -1 ||
                    node.name.text[0].match(/[0-9]/);
    
                assert.ok(expectAliasCheck, `expected Command name ${JSON.stringify(node, null, 2)}`);
            }
            delete node.name.maybeSimpleCommandName;
        },
    
        defaultMethod(node: any) {
            assert.ok(!node.maybeSimpleCommandName, `Command name not expected ${JSON.stringify(node, null, 2)}`);
            delete node.maybeSimpleCommandName;
        }
    });
}
export default async function run(src: string) {
    if (!src) return
    let env = await api.environ.list();
    const ast = parse(src, { resolveEnv: (name: string) => env[name] });
    /*async function ae(ast: any) {
        for (let command of ast.commands) {
            switch (command.type) {
                case "Command": {
                    await runCommand(env, command);
                    break;
                }
                case "Pipeline": {
                    
                    break;
                }
            }
            
        }
    }
    await ae(ast);*/
    runAST(ast);
    
}