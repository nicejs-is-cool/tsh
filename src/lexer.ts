export default function lex(text: string) {
    const matches = text
        .match(/((?:[^\t "'$]|"(?:[^\\]|\\.)+?"|'.+?')+)(?:[\t ]|$|\\\n)+/g)
    if (!matches) return null;
    return matches
        .map(x => x.trim())
}