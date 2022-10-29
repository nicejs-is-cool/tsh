import { type config as Config } from './index'
import { join, resolve } from 'path'
import * as Process from './process_glue'
import * as fs from './fs'
import chalk from 'chalk'
import * as terminal from './terminal'
import * as util from './util';
const path = { join, resolve };
export async function cd(config: typeof Config, args: string[]): Promise<void> {
    return await Process.chdir(path.join(await Process.getWorkdir(), args[0]))
}
export async function ls(config: typeof Config, args: string[]): Promise<void> {
    const targetFolder = path.resolve(await Process.getWorkdir(), args[0] || "./")
    const files = await fs.readdir(targetFolder);
    
    for (let file of files) {
        if (await fs.isDirectory(path.join(targetFolder, file))) {
            await terminal.log(chalk.blue.bold(`${file}`));
            continue;
        }
        terminal.log(file);
    }
}
export async function view(config: typeof Config, args: string[]): Promise<void> {
    const targetFile = path.resolve(await Process.getWorkdir(), args[0]);
    if (!await fs.exists(targetFile)) return await terminal.log("view: Specified files doesn't exist.");
    const data = await fs.readFile(targetFile);
    await terminal.log(data);

}
export function clear() {
    return terminal.log("\x1b[2J\x1b[H")
}
export async function update(config: typeof Config, args: string[]) {
    /*BrowserFS.BFSRequire('fs').writeFileSync("/bin/tsh.js",
    await (
        await fetch("http://localhost:3000/bundle.js")
    ).text()
)*/
    await terminal.log("Fetching tsh...");
    let url = "http://localhost:3000/bundle.js"
    if (args.includes('--url')) {
        url = args[args.indexOf('--url')+1] || url;
    }
    const resp = await fetch(url);
    await terminal.log("Converting to text...");
    const text = await resp.text();
    await terminal.log("Saving to the filesystem...");
    await fs.writeFile("/bin/sh.js", text);
    if (await Process.pid()) {
        await terminal.log('Exiting...');
        await exit();
    } else {
        await terminal.log(`Please ${chalk.bold("reload")} for the changes to take effect.`)
    }
    /*if (!args.includes('--no-reload')) {
        await terminal.log("Reloading...")
        location.reload();
    }*/
}
export function help() {
    return terminal.log(`tsh help:
    cd <dir> - enters a directory
    ls [dir] - lists the current or specified directory
    view <file> - prints a file
    clear - clears the screen
    update [url] - updates tsh (default: localhost:3000/bundle.js)
    alias <alias> <command> - aliases a command to another
    changelog - show changelog
    unalias <alias> - unaliases
    write2 <file> <content> - writes to a file`)
}
export function alias(config: typeof Config, args: string[]) {
    if (args.length < 2) return terminal.log("Too few arguments!")
    //@ts-ignore
    config.aliases[args[0]] = args[1];
    return terminal.log(`Aliased ${chalk.underline(args[0])} to ${chalk.underline(args[1])}`)
}
export function changelog() {
    return terminal.log(`Changelog
    v0.2.0:
        - Added alias command
        - Changed "reboot" to "reload" in update command.
    v0.2.1
        - Running alias with just one argument will remove that alias
    v0.2.2
        - Forget the thing in v0.2.1 now you have to use unalias
    v0.3.0
        - Added write2 command
    v0.3.1
        - Forgor to change help for alias
    v0.3.2
        - Updated readline
        - Now tracking builds as well (they won't have their entries on this changelog tho)
    v0.4.0
        - Updated readline
        - Completely switched to the new syscall api
        - Changed prompt
    v0.5.0
        - Added support for running local files
    v0.5.1
        - Fixed bug where "Unknown command" would show up after you run a local file
    v0.5.2
        - Running update will now exit the shell if its not init.
    v0.5.3
        - update can now take a --url <url> argument to download from a server
    v0.6.0
        - Added mkdir
        - Added rmdir
        - Changed errors from black on red to white on red
        - unalias and alias now give a error instead of a log when not enough arguments are given
        - update now writes to sh.js instead of tsh.js
    v0.6.1
    	- Command is now passed to args[0]
    v0.7.0
        - Added command locations! (running a command that is not a direct path will make the shell look for it in PATH)
    v1.0.0 (beta)
        - Switching to bash-parser
        - Added .tshrc
    v1.1.1 (beta)
        - Added internal commands back
        - Now using the fs.exists API function`)
}
export async function write2(config: typeof Config, args: string[]) {
    return await fs.writeFile(path.resolve(await Process.getWorkdir(), args[0]), args[1])
}
export function unalias(config: typeof Config, args: string[]) {
    if (args.length < 1) return terminal.error('Too few arguments!');
    //@ts-ignore
    delete config.aliases[args[0]];

    return terminal.log(`Removed alias ${chalk.underline(args[0])}`);
}

export async function exit() {
    if (await Process.pid()) return close();
    await terminal.error('Cannot exit: I\'m init!');
}

export async function mkdir(config: typeof Config, args: string[]) {
    if (args.length < 1) return await terminal.error('Too few arguments')
    await fs.mkdir(await util.getAbsolute(args[0]))
}
export async function rmdir(config: typeof Config, args: string[]) {
    if (args.length < 1) return await terminal.error('Too few arguments')
    await fs.rmdir(await util.getAbsolute(args[0]))
}
export async function rm(config: typeof Config, args: string[]) {
    if (args.length < 1) return await terminal.error('Too few arguments')
    await fs.rm(await util.getAbsolute(args[0]))
}
