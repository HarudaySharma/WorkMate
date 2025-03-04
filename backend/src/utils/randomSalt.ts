import env from "../zod.js"

export default function randomSalt() {
    const str = "ab23$@&)*{L(^cd0elx-}"

    const saltLen = +env.SALT_LEN
    const salt: string[] = [];
    while (salt.length != saltLen) {
        let idx = Math.floor(Math.random() * str.length);
        salt.push(str[idx]);
    }

    return salt.join("");
}

