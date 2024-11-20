"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, {useEffect, useState} from "react";
import Loader from "@/components/common/Loader";
import {Toaster} from "react-hot-toast";
import {SessionProvider} from "next-auth/react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <html lang="en">
        <body suppressHydrationWarning={true}>
        <SessionProvider>
            <Toaster position="top-right" reverseOrder={false}/>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
                {loading ? <Loader/> : children}
            </div>
        </SessionProvider>
        </body>
        </html>
    );
}
