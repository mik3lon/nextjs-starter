// types/session.d.ts
import { DefaultSession, DefaultJWT } from "next-auth";

// Define and export the custom session type
export interface CustomSession extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    ttl?: number;
    refreshTtl?: number;
    userProfile?: {
        id: string;
        username: string;
        email: string;
        name: string;
        surname: string;
        role: string;
        profile_picture_url: string;
        createdAt: string;
        updatedAt: string;
    };
}

// Define and export the custom JWT type
export interface CustomJWT extends DefaultJWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    ttl?: number;
    refreshTtl?: number;
    userProfile?: {
        id: string;
        username: string;
        email: string;
        name: string;
        surname: string;
        role: string;
        profile_picture_url: string;
        createdAt: string;
        updatedAt: string;
    };
}
