declare type ERRORC = [number, string];

declare async function do_syscall(syscall: string, ...args: any): Promise<any>;
declare async function do_syscall(syscall: 'exit', exitCode?: number): Promise<void>;
declare async function do_syscall(syscall: 'getpid'): Promise<number>;
declare async function do_syscall(syscall: 'uptime'): Promise<number>;
declare async function do_syscall(syscall: 'sus'): Promise<"amogus">;
declare async function do_syscall(syscall: 'write', handle: number, data: any): Promise<void>;
declare async function do_syscall(syscall: 'read', handle: number): Promise<string>;
declare async function do_syscall(syscall: 'dup', handle: number): Promise<void>;
declare async function do_syscall(syscall: 'close', handle: number): Promise<void>;
declare async function do_syscall(syscall: 'ioctl', ...args: any): Promise<any>;
declare async function do_syscall(syscall: 'getwdir'): Promise<string>;
declare async function do_syscall(syscall: 'chdir'): Promise<number>;

declare async function close(int: number): void;

declare namespace api {
    export namespace fd {
        export function write(fd: number, buf: any): Promise<void>;
        export function read(fd: number, length: number): Promise<Uint8Array>;
        export function seek(fd: number, loc: number, whence: string): Promise<void>;
        export function dup(fd: number, newfd: number): Promise<void>;
        export function close(fd: number): Promise<void>;
    }
    export namespace fs {
        export function chwd(path: string): Promise<void>;
        export function getwd(): Promise<string>;
        export function readdir(path: string): Promise<string[]>;
        export function open(path: string, flags: string, fd?: number): Promise<void>;
        export interface Stat {
            isDirectory: boolean;
            size: number;
        }
        export function stat(path: string): Promise<Stat>;
        export function exists(path: string): Promise<boolean>;
        export function mkdir(path: string): Promise<void>;
        export function rmdir(path: string): Promise<void>;
        export function unlink(path: string): Promise<void>;
    }
    export namespace proc {
        export function getpid(): Promise<number>;
        export function wait(pid: number): Promise<number>;
        export interface CreateProcessOpt {
            replace?: boolean;
            environ?: { [key: string]: string };
            fd_map?: { [key: number]: number }
        }
        /**
         * Creates a process.
         * @param url URL (prefix with "u:") or path of the process main executable
         * @param args Arguments to be passed onto the process
         * @param opt no clue what replace and fd_map do but environ is the environment variables for that process
         * @returns pid
         */
        export function proc(url: string, args: string[], opt: CreateProcessOpt): Promise<number>;
    }
    export namespace environ {
        export function set(key: string, value: string): Promise<void>;
        export function get(key: string): Promise<string>;
        export function list(): Promise<{ [key: string]: string }>;
    }
}
