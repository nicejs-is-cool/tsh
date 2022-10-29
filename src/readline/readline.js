export let readline_history = [""];
export default async function readline(ps, psl){
    function parse_ansi(string){
        let line = "";
        let args = [];
        let numbers = "0123456789";
        for(let i=0;i<string.length;i++){
            if(numbers.includes(string[i])){
                line += string[i]
            } else if (string[i] == ";") {
                args.push(parseInt(line))
                line="";
            } else {
                args.push(parseInt(line))
                return {
                    type: string[i],
                    args, ended_on: i+1
                }
            }
        }
    }
    let b = new TextDecoder();
    let line = "";
    let cursorPos = 0;
    let x = readline_history.length;
    while(true){
        await api.fd.write(1, `\r\x1b[K${ps}${line.slice(0,cursorPos)}\x1b[s${line.slice(cursorPos)}\x1b[u`);
        let e = b.decode(await api.fd.read(0, 1));
        for(let i=0;i<e.length;){
            switch(e[i]){
                case "\x0d":
                    //if(l[x-1]!=line) l.push(line);
                    await api.fd.write(1, "\n");
                    // readline_history=readline_history.filter(readline_history=>readline_history.length);
                    // if(readline_history.length > 200) {
                    //     readline_history = readline_history.slice(-180);
                    // }
                    return line;
                    break;
                case "\x7f": // Backspace
                    i++
                    if(!cursorPos) break;
                    line = line.slice(0, cursorPos-1) + line.slice(cursorPos);
                    cursorPos--;
                    break;
                case "\x08": // Ctrl+BackSpace
                    i++
                    if(!cursorPos) break;
                    let q = line.lastIndexOf(" ", cursorPos)-1;
                    if(!q) q = 0;
                    let offset = cursorPos - q;
                    line = line.slice(0, cursorPos - offset) + line.slice(cursorPos);
                    cursorPos -= offset;
                    break;
                case "\x1b": 
                    i++
                    if(e[i] == "[") {
                        i++
                        let q = parse_ansi(e.slice(i));
                        i += q.ended_on;
                        if(q.args[0] == 1 && q.args[1] == 5) { // ctrl
                            switch(q.type){
                                case "C": // <-
                                    cursorPos = line.indexOf(" ", cursorPos+1);
                                    if(cursorPos == -1) cursorPos = line.length;
                                    break;
                                case "D": // ->
                                    cursorPos = line.lastIndexOf(" ", cursorPos-1);
                                    if(cursorPos == -1) cursorPos = 0;
                                    break;
                                case "H": cursorPos = 0; break; // Home
                                case "F": cursorPos = line.length; break; // End
                                break;
                            }
                        } else if(q.type == "~" && q.args[0] == 3 && q.args[1] == 5) { // Ctrl+Delete
                            let q=line.indexOf(" ",cursorPos+1);
                            if(q==-1)q=line.length;
                            line = line.slice(0,cursorPos) + line.slice(q);
                        } else {
                            switch(q.type){
                                // case "A": x = do_syscall("open", "/sus.txt", "r")Math.min(x + 1, readline_history.length - 1); line=readline_history[x]; cursorPos = line.length; break;
                                // case "A": case "B": cursorPos = line.length; break;
                                case "C": cursorPos = Math.min(cursorPos + 1, line.length); break; // <-
                                case "D": cursorPos = Math.max(cursorPos - 1, 0); break; // ->
                                case "H": cursorPos = 0; break; // Home
                                case "F": cursorPos = line.length; break; // End
                                case "~": 
                                    if(q.args[0] == 3) { // Delete
                                        line = line.slice(0, cursorPos) + line.slice(cursorPos+1);
                                    }        
                                break;
                            }
                        }
                    }
                    break;
                default:
                    line = line.slice(0,cursorPos)+e[i]+line.slice(cursorPos);
                    i++
                    cursorPos++
            }
        }
    }
}