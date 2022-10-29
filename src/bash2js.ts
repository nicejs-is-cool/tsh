import parse from "bash-parser";

export function transpile(str: string) {
    const ast = parse(str);
    let transpiled = "";
    function treeWalk(ast: any) {
        switch (ast.type) {
            case "Script": {
                transpiled += `(async (extern) => {`;
                for (let cmd of ast.commands) {
                    treeWalk(cmd);
                }
                transpiled += `})();`;
                break;
            }
            case "Command": {
                transpiled += 'extern.run("'
                treeWalk(ast.name);
                transpiled += '",';
                for (let arg of ast.suffix) {
                    treeWalk(arg);
                }
                transpiled += ")\n";
            }
            case "Word": {
                transpiled += ast.text;
                break;
            }
        }
    }
    treeWalk(ast);
    return transpiled;
}