import { StatusCodes } from "http-status-codes";
import logger from "../logger";
import { Errorr } from "../middlewares/error.middleware";
import { AuthProvider, GithubAccessToken, GithubEmailResp, GithubUser, GoogleUser } from "../types";
import env from "../zod";
import { User } from "../database_schema";

export default async function fetchOAuthUser(code: string, provider: AuthProvider): Promise<Partial<User> | undefined> {
    if (provider === "google") {
        logger.info("auth using google");
        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${code}`,
                },
            })

            const data = await res.json() as GoogleUser;

            return {
                name: data.name,
                email: data.email,
                email_verified: data.email_verified,
                profile_picture: data.picture,
            }

        } catch (err) {
            throw err
        }
    } else if (provider === "github") {
        // INFO: to check how the github auth flow works visit the link below
        //  https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

        logger.info("auth using github");

        try {
            const res = await fetch("https://github.com/login/oauth/access_token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    code: `${code}`,
                    client_id: env.GITHUB_OAUTH_CLIENT_ID,
                    client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
                    redirect_uri: env.GITHUB_OAUTH_REDIRECT_URI, // NOTE: this should be same as the one used during Authorization code and is mandatory to specify
                })
            })

            const { access_token, scope } = await res.json() as GithubAccessToken

            logger.info({ access_token, scope });
            if (!scope.includes("user:email")) {
                throw new Errorr("permission to read user info not granted", StatusCodes.BAD_GATEWAY)
            }

            // fetching the user info
            const userResp = await fetch(`https://api.github.com/user`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Accept": "application/json",
                }
            });

            const userData = await userResp.json() as GithubUser;

            // Fetching the emails separately
            const emailResp = await fetch(`https://api.github.com/user/emails`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                }
            });

            const emails = await emailResp.json() as GithubEmailResp[];
            if (emails.length === 0) {
                throw new Errorr("no emails found for the user", StatusCodes.BAD_GATEWAY)
            }

            let email = emails.find(email => email.primary)
            if (email === undefined) {
                email = emails[0];
            }

            return {
                name: userData.login,
                email: email.email,
                email_verified: email.verified,
                profile_picture: userData.avatar_url,
            }
        } catch (err) {
            throw err
        }

    }

}
