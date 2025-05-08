"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oAuth = exports.signup = exports.login = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_js_1 = __importDefault(require("../../logger.js"));
const mysql_service_js_1 = __importDefault(require("../../services/mqsql/mysql.service.js"));
const error_middleware_js_1 = require("../../middlewares/error.middleware.js");
const cookieOptions_js_1 = __importDefault(require("../../config/cookieOptions.js"));
const generateHashedPass_js_1 = __importDefault(require("../../utils/generateHashedPass.js"));
const comparePassword_js_1 = __importDefault(require("../../utils/comparePassword.js"));
const jwt_js_1 = require("../../utils/jwt.js");
const generatePassword_js_1 = __importDefault(require("../../utils/generatePassword.js"));
const UserRepository_service_js_1 = __importDefault(require("../../services/mqsql/UserRepository.service.js"));
const fetchUserDetails_js_1 = __importDefault(require("../../utils/fetchUserDetails.js"));
const generateUID_js_1 = __importDefault(require("../../utils/generateUID.js"));
//
// TODO: Testing these routes extensively
const login = async (req, res, next) => {
    logger_js_1.default.info("HIT: /auth/login");
    const { username, email, password } = req.body;
    try {
        const userRepo = new UserRepository_service_js_1.default(await mysql_service_js_1.default.getConnection());
        const user = await userRepo.find({ username, email });
        logger_js_1.default.info({ user });
        if (user === null) {
            next(new error_middleware_js_1.Errorr("user not found", http_status_codes_1.StatusCodes.NOT_FOUND));
            return;
        }
        // user is found
        const validPass = await (0, comparePassword_js_1.default)(password, user.hash_salt, user.hashed_password);
        if (!validPass) {
            next(new error_middleware_js_1.Errorr("invalid password", http_status_codes_1.StatusCodes.UNAUTHORIZED));
        }
        const token = (0, jwt_js_1.generateToken)({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            profile_picture: user.profile_picture,
        });
        res.cookie("access_token", token, (0, cookieOptions_js_1.default)());
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: "true" });
    }
    catch (err) {
        next(new error_middleware_js_1.Errorr(`${err}`, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
    return;
};
exports.login = login;
const signup = async (req, res, next) => {
    logger_js_1.default.info("HIT: /auth/signup");
    const { username, name, email, password } = req.body;
    logger_js_1.default.info(req.body);
    if (username === undefined || email === undefined || password === undefined) {
        next(new error_middleware_js_1.Errorr("Insufficient data provided", http_status_codes_1.StatusCodes.BAD_REQUEST));
        return;
    }
    // check for the user in db
    try {
        const userRepo = new UserRepository_service_js_1.default(await mysql_service_js_1.default.getConnection());
        const user = await userRepo.find({ username, email });
        if (user !== null) {
            next(new error_middleware_js_1.Errorr("account already exists with username or email", http_status_codes_1.StatusCodes.CONFLICT)); // conflict
            return;
        }
        const { hashedPass, salt } = await (0, generateHashedPass_js_1.default)(password);
        const newUser = {
            username,
            name,
            email,
            hashed_password: hashedPass,
            hash_salt: salt,
            profile_picture: `https://ui-avatars.com/api/?name=${username}`, // default profile pics
        };
        await userRepo.add(newUser);
        const addedUser = await userRepo.find({ username });
        if (addedUser === null) {
            next(new error_middleware_js_1.Errorr("failed to find added user in db", http_status_codes_1.StatusCodes.NOT_FOUND));
            return;
        }
        const token = (0, jwt_js_1.generateToken)({
            id: addedUser.id,
            name: addedUser.name,
            username: addedUser.username,
            email: addedUser.email,
            profile_picture: addedUser.profile_picture,
        });
        res.cookie("access_token", token, (0, cookieOptions_js_1.default)());
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: "true" });
    }
    catch (err) {
        logger_js_1.default.error(err);
        next(new error_middleware_js_1.Errorr("", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
};
exports.signup = signup;
const oAuth = async (req, res, next) => {
    logger_js_1.default.info("HIT: /auth/oauth");
    const { provider } = req.params;
    const { code } = req.body;
    logger_js_1.default.info({ provider, code });
    let u = undefined;
    try {
        u = await (0, fetchUserDetails_js_1.default)(code, provider);
    }
    catch (err) {
        logger_js_1.default.error(err);
        next(new error_middleware_js_1.Errorr("", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
        return;
    }
    if (u === null || u === undefined || u.email === undefined) {
        next(new error_middleware_js_1.Errorr("Insufficient data provided", http_status_codes_1.StatusCodes.BAD_REQUEST));
        return;
    }
    // check for the user in db
    try {
        const userRepo = new UserRepository_service_js_1.default(await mysql_service_js_1.default.getConnection());
        const user = await userRepo.find({ email: u.email });
        if (user !== null) {
            logger_js_1.default.info("user found in db");
            // redirect the user to login user must have already signup using the service provider.
            const token = (0, jwt_js_1.generateToken)({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture,
            });
            res.cookie('access_token', token, (0, cookieOptions_js_1.default)());
            res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
            return;
        }
        const username = u.name + (0, generateUID_js_1.default)();
        const { hashedPass, salt } = await (0, generateHashedPass_js_1.default)((0, generatePassword_js_1.default)());
        const newUser = {
            username,
            name: u.name,
            email: u.email,
            email_verified: u.email_verified,
            hashed_password: hashedPass,
            hash_salt: salt,
            profile_picture: u.profile_picture || `https://ui-avatars.com/api/?name=${username}`, // default profile pics
        };
        await userRepo.add(newUser);
        const addedUser = await userRepo.find({ username });
        if (addedUser === null) {
            next(new error_middleware_js_1.Errorr("failed to find added user in db", http_status_codes_1.StatusCodes.NOT_FOUND));
            return;
        }
        const token = (0, jwt_js_1.generateToken)({
            id: addedUser.id,
            name: addedUser.name,
            username: addedUser.username,
            email: addedUser.email,
            profile_picture: addedUser.profile_picture,
        });
        res.cookie('access_token', token, (0, cookieOptions_js_1.default)());
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: "true" });
    }
    catch (err) {
        logger_js_1.default.error(err);
        next(new error_middleware_js_1.Errorr("", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
    next();
};
exports.oAuth = oAuth;
