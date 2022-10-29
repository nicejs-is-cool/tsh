import fs from 'fs/promises'

const lineEndings = process.platform === "win32" ? '\r\n' : '\n'

const indexf = await fs.readFile("./src/index.ts", "utf-8");
let line = 15
const ifl = indexf.split(lineEndings);
console.log("build", parseInt(ifl[line].slice(11))+1)
ifl[line] = `    build: ${parseInt(ifl[line].slice(11))+1}`;

await fs.writeFile("./src/index.ts", ifl.join(lineEndings))