"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchOAuthUser;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../logger"));
const error_middleware_1 = require("../middlewares/error.middleware");
const zod_1 = __importDefault(require("../zod"));
async function fetchOAuthUser(code, provider) {
    if (provider === "google") {
        logger_1.default.info("auth using google");
        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${code}`,
                },
            });
            const data = await res.json();
            return {
                name: data.name,
                email: data.email,
                email_verified: data.email_verified,
                profile_picture: data.picture,
            };
        }
        catch (err) {
            throw err;
        }
    }
    else if (provider === "github") {
        // INFO: to check how the github auth flow works visit the link below
        //  https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
        logger_1.default.info("auth using github");
        try {
            const res = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    code: `${code}`,
                    client_id: zod_1.default.GITHUB_OAUTH_CLIENT_ID,
                    client_secret: zod_1.default.GITHUB_OAUTH_CLIENT_SECRET,
                    redirect_uri: zod_1.default.GITHUB_OAUTH_REDIRECT_URI, // NOTE: this should be same as the one used during Authorization code and is mandatory to specify
                })
            });
            const { access_token, scope } = await res.json();
            logger_1.default.info({ access_token, scope });
            if (!scope.includes("user:email")) {
                throw new error_middleware_1.Errorr("permission to read user info not granted", http_status_codes_1.StatusCodes.BAD_GATEWAY);
            }
            // fetching the user info
            const userResp = await fetch(`https://api.github.com/user`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Accept": "application/json",
                }
            });
            const userData = await userResp.json();
            // Fetching the emails separately
            const emailResp = await fetch(`https://api.github.com/user/emails`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                }
            });
            const emails = await emailResp.json();
            if (emails.length === 0) {
                throw new error_middleware_1.Errorr("no emails found for the user", http_status_codes_1.StatusCodes.BAD_GATEWAY);
            }
            let email = emails.find(email => email.primary);
            if (email === undefined) {
                email = emails[0];
            }
            return {
                name: userData.login,
                email: email.email,
                email_verified: email.verified,
                profile_picture: userData.avatar_url,
            };
        }
        catch (err) {
            throw err;
        }
    }
}
