"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generatePassword;
function generatePassword() {
    const str = "ab23$@&)*yo,p{L(^cd0elx-}";
    const PASS_LEN = 12;
    const pass = [];
    while (pass.length != PASS_LEN) {
        let idx = Math.floor(Math.random() * str.length);
        pass.push(str[idx]);
    }
    return pass.join("");
}
