declare module 'readline' {
    export default async function readline(ps: string, psl: number): Promise<string>;
}