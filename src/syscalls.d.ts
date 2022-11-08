declare type TypedArray = | Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array

declare type t_whence = 0|1|2;
declare type t_mode = "r"|"w"|"a"|"r+"|"w+"|"a+"|"wx"|"ax"|"wx+"|"ax+";
declare type t_environ = { [key: string]: string };
declare type t_fstat = {
    atime: Date;
    birthtime: Date;
    ctime: Date;
    mtime: Date;
    fileData: null; 
    isDirectory: boolean;
    isFile: boolean;
    isSymbolicLink: boolean;
    size: number;
    // blksize: 4096;
    // blocks: 8;
    // dev: 0;
    // gid: 0;
    // ino: 0;
    // mode: 511;
    // nlink: 1;
    // rdev: 0;
    // uid: 0;
}
declare type t_opts = {
    resizable: boolean;
    width_min: number;
    width_max: number;
    width: number;
    height_min: number;
    height_max: number;
    height: number;
    title: string;
    closable: boolean;
    maximizable: boolean;
    minimizable: boolean;
}

export namespace api {
    export namespace fd {
        export function read(fd: number, length: number): Promise<Uint8Array>;
        export function write(fd: number, buffer: string|ArrayBuffer|TypedArray): Promise<number>;
        export function seek(fd: number, location: number, whence: t_whence): Promise<void>;
        export function dup(fd: number, newfd?: number): Promise<number>;
        export function close(fd: number): Promise<void>;
        export function ioctl(fd: number, request: string, ...args: any[]): Promise<any>
        export namespace open {
            /** Opens a null file descriptor. */
            export function blackhole(fd?: number): Promise<number>;
            /** Opens an echo file descriptor. */
            export function pipe(fd?: number): Promise<number>;
        }
    }
    export namespace fs {
        /** Changes current working directory */
        export function chwd(path: string): Promise<void>;
        /** Get the current working directory, maybe it can be synchronous? */
        export function getwd(): Promise<string>;
        export function readdir(path: string): Promise<string[]>;
        export function open(path: string, flags: t_mode, fd?: number): Promise<number>;
        export function stat(path: string): Promise<t_fstat>;
        export function mkdir(path: string): Promise<void>;
        export function rmdir(path: string): Promise<void>;
        export function unlink(path: string): Promise<void>;
        export function exists(path: string): Promise<boolean>;
    }
    export namespace proc {
        export function getpid(): Promise<number>;
        export function wait(pid: number): Promise<void>;
        export function proc(url: string, args: string[], opts: {
            replace?: boolean,
            environ?: t_environ,
            fd_map?: { [key: number]: string }
        }): Promise<number>;
    }
    export namespace environ {
        export function set(key: string, value: string): Promise<void>;
        export function get(key: string): Promise<string>;
        export function list(): Promise<t_environ>;
    }
    export namespace window {
        export function open(type: "canvas", opts: t_opts): Promise<[number, OffscreenCanvas]>;
        export function nextEvent(id: number): Promise<Event>;
        export function close(id: number, force: boolean): Promise<void>;
    }
}