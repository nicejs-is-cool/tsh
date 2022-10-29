import { inspect } from 'util'
import chalk from 'chalk'

export function log(data: any): Promise<void> {
    //if (typeof data === "string") return do_syscall("write", 1, data+"\n")
    //return do_syscall("write", 1, util.inspect(data, {colors: true})+"\n")
    if (typeof data === "string") return api.fd.write(1, data+"\n");
    return api.fd.write(1, inspect(data, {colors: true})+"\n");
}

export function error(data: any) {
    api.fd.write(1, chalk.bgRed.white(" ERROR ") + " " + (data.stack || data) + "\n");
    // print to devtools too why not
    console.error(data);
}
