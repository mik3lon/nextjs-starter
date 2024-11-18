import { getServerSession } from "next-auth";
import Dashboard from "@/components/Dashboard/Dashboard";
import {Metadata} from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {CustomSession} from "@/types/next-auth";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home() {
    const session = await getServerSession(authOptions) as CustomSession;

    // Access the session tokens if available
    const accessToken = session?.accessToken;
    const refreshToken = session?.refreshToken;

    return (
        <>
            <DefaultLayout>
                <div>
                    <h1>Session Information</h1>
                    <p>Access Token: {accessToken}</p>
                    <p>Refresh Token: {refreshToken}</p>
                </div>
                <Dashboard/>
            </DefaultLayout>
        </>
    );
}
