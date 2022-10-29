export function getWorkdir() {
    //return do_syscall('getwdir')
    return api.fs.getwd();
}
export function chdir(str: string) {
    //return do_syscall('chdir', str);
    return api.fs.chwd(str);
}
export function mkproc(path: string, args: string[], opt: any): Promise<number> {
    return api.proc.proc(path, args, opt || {});
}
export function pid(): Promise<number> {
    return api.proc.getpid()
}
export namespace environ {
    export function get(key: string): Promise<string> {
        return api.environ.get(key);
    }
    export function set(key: string, value: string): Promise<void> {
        return api.environ.set(key, value);
    }
}