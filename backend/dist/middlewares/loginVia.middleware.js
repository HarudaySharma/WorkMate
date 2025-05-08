"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_js_1 = require("./error.middleware.js");
const loginVia = (req, _, next) => {
    const { username, email } = req.body;
    if (username != undefined) {
        req.head = req.head ? { ...req.head, viaEmail: false } : { viaEmail: false };
        next();
    }
    else if (email != undefined) {
        req.head = req.head ? { ...req.head, viaEmail: true } : { viaEmail: true };
        next();
    }
    next(new error_middleware_js_1.Errorr("login failed, data missing", 400));
};
exports.default = loginVia;
