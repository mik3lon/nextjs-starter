"use client";
import React from "react";

export default function EmptyLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            {children}
        </div>
    );
}
