export type Mode = "r" | "r+" | "w" | "w+" | "a" | "a+" | "ax" | "ax+"

export let fd_counter = 100;

export async function open(file: string, mode: Mode): Promise<number> {
    //return do_syscall("fs_open", file, mode);
    const fd = fd_counter++
    await api.fs.open(file, mode, fd);
    return fd;
}
export function close(h: number): Promise<void> {
    //return do_syscall("close", h);
    return api.fd.close(h);
}
export function read(h: number, count: number) {
    //return do_syscall("read", h, count);
    return api.fd.read(h, count);
}
export function write(h: number, str: string): Promise<void> {
    //return do_syscall("write", h, str);
    return api.fd.write(h, str);
}
export function size(file: string): Promise<number> {
    throw new Error('API removed');
    return do_syscall("fs_size", file);
}
export function exists(file: string): Promise<boolean> {
    //throw new Error('API removed');
    //return do_syscall("fs_exists", file)
    return api.fs.exists(file);
}
export function stat(file: string): Promise<api.fs.Stat> {
    return do_syscall("fs_stat", file);
}

export async function readFile(file: string): Promise<string> {
    const h = await open(file, "r");
    const fsize = (await stat(file)).size;
    const data = await read(h, fsize);
    await close(h);
    let texdec = new TextDecoder();
    return texdec.decode(data);
}

export async function readdir(path: string): Promise<string[]> {
    //return do_syscall("fs_readdir", path);
    return api.fs.readdir(path);
}

export async function isDirectory(path: string): Promise<boolean> {
    //return do_syscall("fs_isdir", path);
    return (await api.fs.stat(path)).isDirectory;
}

export async function writeFile(path: string, data: string): Promise<void> {
    const h = await open(path, 'w');
    await write(h, data);
    await close(h);
}

export async function pathSegmentsExist(path: string) {
    const psplit = path.split('/').slice(1, -1)
    let newpath = [];
    for (let segment of psplit) {
        newpath.push(segment)
        if (!await exists(newpath.join('/'))) {
            throw `${newpath.join('/')} does not exist`;
        }
    }
}

export async function mkdir(path: string): Promise<void> {   
    await pathSegmentsExist(path);
    api.fs.mkdir(path);
}

export async function rmdir(path: string): Promise<void> {
    await pathSegmentsExist(path);
    api.fs.rmdir(path);
}

export async function rm(path: string): Promise<void> {
    await pathSegmentsExist(path);
    api.fs.unlink(path);
}