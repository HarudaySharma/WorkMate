"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const zod_js_1 = __importDefault(require("./zod.js"));
const logger_js_1 = __importDefault(require("./logger.js"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const workspace_1 = __importDefault(require("./routes/workspace"));
const chat_1 = __importDefault(require("./routes/chat"));
const error_middleware_js_1 = __importStar(require("./middlewares/error.middleware.js"));
const mysql_service_js_1 = __importDefault(require("./services/mqsql/mysql.service.js"));
const ws_server_js_1 = __importDefault(require("./ws-server.js"));
mysql_service_js_1.default.initializeDatabase();
// initializing the router
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/", (_, res) => {
    res.json({
        status: "sever is running",
    });
});
// routes
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/workspace', workspace_1.default);
app.use('/api/chat', chat_1.default);
app.use("*", (_, __, next) => {
    next(new error_middleware_js_1.Errorr("Not found", 404));
});
app.use(error_middleware_js_1.default);
// starting the server
const PORT = zod_js_1.default.PORT;
app.listen(PORT, (err) => {
    if (err) {
        logger_js_1.default.fatal(`failed to start the server at PORT: ${PORT}`);
        return;
    }
    logger_js_1.default.info(`server running on http://localhost:${PORT}`);
});
(0, ws_server_js_1.default)();
process.on("SIGINT", async () => {
    await mysql_service_js_1.default.close();
    process.exit(0);
});
