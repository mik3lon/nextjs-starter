import Dashboard from "@/components/Dashboard/Dashboard";
import {Metadata} from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Home() {
    return (
        <>
            <DefaultLayout>
                <Dashboard/>
            </DefaultLayout>
        </>
    );
}
