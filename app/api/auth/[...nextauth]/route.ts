import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import {CustomJWT, CustomSession} from "@/types/next-auth";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            idToken: true,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // If this is the initial login, get the id_token from the provider
            if (account?.id_token) {
                token.idToken = account.id_token;

                try {
                    // Request the JWT from your backend using the id_token
                    const response = await fetch("https://your-backend.com/api/auth/jwt", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id_token: account.id_token }),
                    });

                    if (response.ok) {
                        const { access_token, refresh_token, ttl, refresh_ttl } = await response.json();
                        token.accessToken = access_token;
                        token.refreshToken = refresh_token;
                        token.ttl = ttl;
                        token.refreshTtl = refresh_ttl;
                    } else {
                        console.error("Failed to retrieve JWT from backend");
                    }
                } catch (error) {
                    console.error("Error requesting JWT:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
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
})

export { handler as GET, handler as POST }