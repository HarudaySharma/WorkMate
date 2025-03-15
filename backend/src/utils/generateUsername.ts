export default function generateUsername(prefix: string) {
    const str = "ab23$@&)*yo,p{L(^cd0elx-}"

    const LEN = 15
    const suffix: string[] = [];
    while (suffix.length != LEN) {
        let idx = Math.floor(Math.random() * str.length);
        suffix.push(str[idx]);
    }

    return prefix + suffix.join("");
}
