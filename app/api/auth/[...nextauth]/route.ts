import NextAuth, {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {CustomJWT, CustomSession} from "@/types/next-auth";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || '';

export const authOptions : NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            idToken: true,
            authorization: {
                params: {
                    scope: "openid profile email", // Request specific scopes from Google
                },
            },
        }),
    ],
    callbacks: {
        async signIn({account}) {
            if (account?.provider && account.id_token) {
                const providerSigninUrl = `${BACKEND_BASE_URL}/users/social/signin/${account.provider}`;

                try {
                    const response = await fetch(providerSigninUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({id_token: account.id_token}),
                    });

                    if (response.ok) {
                        // Extract and store tokens in the account object to access in the jwt callback
                        const {access_token, refresh_token, access_token_ttl, refresh_token_ttl} = await response.json();

                        account.access_token = access_token;
                        account.refresh_token = refresh_token;
                        account.ttl = access_token_ttl;
                        account.refresh_ttl = refresh_token_ttl;
                        return true; // Continue with sign-in
                    } else {
                        console.error("Backend authentication failed.");
                        return "/error?error=auth_failed"; // Redirect to error page
                    }
                } catch (error) {
                    console.error("Error contacting backend:", error);
                    return "/error?error=auth_failed"; // Redirect to error page
                }
            }
            return true; // Continue if no backend call is needed
        },
        async jwt({token, account}) {
            if (account?.access_token) {
                // Store backend tokens in the JWT if available
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.ttl = account.ttl;
                token.refreshTtl = account.refresh_ttl;
            }
            return token;
        },
        async session({session, token}) {
            const customSession = session as CustomSession; // Type session as CustomSession
            const customToken = token as CustomJWT; // Type token as CustomJWT

            // Attach tokens and expiry info to the session
            customSession.accessToken = customToken.accessToken;
            customSession.refreshToken = customToken.refreshToken;
            customSession.ttl = customToken.ttl;
            customSession.refreshTtl = customToken.refreshTtl;

            return customSession;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
        error: "/error",
    },
}


const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
