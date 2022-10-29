import chalk from 'chalk';
import * as terminal from './terminal';
import readline from 'readline'
import lexer from './lexer';
import * as BuiltIn from './commands'
import * as Process from './process_glue'
import * as fs from './fs'
import * as path from 'path';

export const config = {
    aliases: {
        'cls': 'clear',
        'dir': 'ls',
        'rename': 'mv'
    },
    build: 60
}

const Commands = BuiltIn as {[key: string]: Function};

import interp from './bashinterp';

export async function main(argv: string[]) {
    terminal.log("tsh v1.2.0-" + config.build.toString().padStart(3, "0"));
    if (await fs.exists("/.tshrc")) {
        const tshrcdata = await fs.readFile("/.tshrc");
        await interp(tshrcdata).catch(console.error);
    }
    while (true) {
        let prompt = `${chalk.green('tsh@duckos')}:${chalk.blue(await Process.getWorkdir())}$ `
        const q = await readline(prompt, prompt.length);
        //#region Depreceated
        /*const tokens = lexer(q);
        if (!tokens) continue;
        let command = tokens[0];
        for (let [cmd, alias] of Object.entries(config.aliases)) {
            if (command === cmd) {command = alias; break}
        }
        const args = tokens.slice(1);
        if (Commands[command]) {
            try {
                await Commands[command](config, args)
            } catch(err) {
                terminal.error(err);
            }
            continue;
        } else {
            if (/^((\.+)|\/)/.test(command)) {
                // local file lets gooo
                let filePath: string;
                if (command.startsWith('.')) {
                    // relative
                    filePath = path.join(await Process.getWorkdir(), command);
                } else {
                    filePath = command;
                }
                if (!command.endsWith('.js')) {
                    filePath += ".js";
                }
                if (!await fs.exists(filePath)) {
                    await terminal.log(chalk.bold(filePath) + " does not exist");
                    continue;
                }

                const pid = await api.proc.proc(filePath, [command, ...args], {});
                //terminal.log(`PID: ${pid}`);
                await api.proc.wait(pid);
                continue;
            }
            const commandPath = await findCommand(command+".js");
            if (commandPath) {
                const pid = await api.proc.proc(commandPath, [command, ...args], {});
                await api.proc.wait(pid);
                continue;
            }
        }
        terminal.log(chalk.bold('Unknown command: ') + command);*/
        //#endregion
        await interp(q);
    }
}
