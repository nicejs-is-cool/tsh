declare module 'bash-parser' {
    export default function parse(str: string, opt: any): any;
}
declare module 'bash-ast-traverser' {
    export default function traverse(ast: any, opt: any): any;
}