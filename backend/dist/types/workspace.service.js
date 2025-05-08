"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkmateReturnObj = exports.WorkmateError = void 0;
class WorkmateError {
    constructor(type, message, httpStatusCode, error) {
        this.httpStatusCode = httpStatusCode;
        this.type = type;
        this.message = message;
        this.error = error;
    }
}
exports.WorkmateError = WorkmateError;
class WorkmateReturnObj {
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}
exports.WorkmateReturnObj = WorkmateReturnObj;
;
