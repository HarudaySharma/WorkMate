"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errorr = void 0;
class Errorr extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
    format() {
        return {
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}
exports.Errorr = Errorr;
const errorHandler = (err, __, res, _) => {
    res.status(err.statusCode || 500);
    res.json(err.format());
};
exports.default = errorHandler;
