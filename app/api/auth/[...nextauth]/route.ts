import NextAuth, {Account, NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {CustomJWT, CustomSession} from "@/types/session";
import {me} from "@/actions/user/me";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || '';

export const authOptions: NextAuthOptions = {
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
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined) {
                if (!credentials) {
                    throw new Error("No credentials provided");
                }

                const { email, password } = credentials;

                try {
                    const response = await fetch(`${BACKEND_BASE_URL}/users/auth/signin`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${btoa(`${email}:${password}`)}`, // Add Basic Auth header
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Invalid credentials");
                    }

                    const {
                        id, // Ensure this is provided by the backend
                        email: returnedEmail,
                        access_token,
                        refresh_token,
                        access_token_ttl,
                        refresh_token_ttl,
                    } = await response.json();

                    // Return an object matching the User interface
                    return {
                        id, // Required field
                        email: returnedEmail, // Ensure this is consistent with your backend
                        access_token,
                        refresh_token,
                        ttl: access_token_ttl,
                        refresh_ttl: refresh_token_ttl,
                    };
                } catch (error) {
                    console.error("Login error:", error);
                    throw new Error("Invalid credentials");
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ account }: { account: Account | null }) { // Explicitly typing account
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
                        const {
                            access_token,
                            refresh_token,
                            access_token_ttl,
                            refresh_token_ttl
                        } = await response.json();

                        account.access_token = access_token;
                        account.refresh_token = refresh_token;
                        account.ttl = access_token_ttl;
                        account.refresh_ttl = refresh_token_ttl;
                        return true; // Continue with sign-in
                    } else {
                        console.error("Backend authentication failed.");
                        console.error("Response", response);
                        return "/error?error=auth_failed"; // Redirect to error page
                    }
                } catch (error) {
                    console.error("Error contacting backend:", error);
                    return "/error?error=auth_failed"; // Redirect to error page
                }
            }
            return true; // Continue if no backend call is needed
        },
        async jwt({token, account, user}) {
            // Attach tokens if available
            if (account?.access_token || user?.access_token) {
                // Store backend tokens in the JWT if available
                token.accessToken = account?.access_token || user?.access_token;
                token.refreshToken = account?.refresh_token || user?.refresh_token;
                token.ttl = account?.ttl || user?.ttl;
                token.refreshTtl = account?.refresh_ttl || user?.refresh_ttl;
            }

            // Fetch the user profile using the `me` function if accessToken exists
            if (account?.access_token) {
                try {
                    const response = await me(account.access_token);

                    token.userProfile = response.data;
                    console.log("USERPROFILE", response.data)
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
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

            // Attach the user profile
            if (customToken.userProfile) {
                customSession.userProfile = customToken.userProfile; // Ensure `CustomSession` is updated with `userProfile`
            }

            console.log("CUSTOM SESSION", customSession)

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
