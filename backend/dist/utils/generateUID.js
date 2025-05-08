"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateUID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
exports.default = generateUID;
