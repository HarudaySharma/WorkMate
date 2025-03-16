import { User } from "../database_schema.js";

export interface JWTPayload {
    data: {
        user: Pick<User, "name" | "profile_picture" | "username" | "email" | "id">;
    }
}

export type AuthProvider = "google" | "github" | "facebook" | "workmate";


export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    email: string;
    email_verified: boolean;
    picture: string;
}

export interface GithubEmailResp {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string;
}

export interface GithubUser {
    login: string; // username
    avatar_url: string; // profile_picture
    gravatar_id: string;
    url: string // user profile url
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
    name: string,
    company: null,
    blog: string;
    location: string
    email: null,
    hireable: boolean;
    bio: string;
    twitter_username: string;
    notification_email: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: Date;
    updated_at: Date;
}

export interface GithubAccessToken {
    access_token: string,
    scope: string,
    token_type: string
};
