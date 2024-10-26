// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();

    return (
        <div>
            <h1>Welcome, {session?.user?.name}</h1>
            <p>Email: {session?.user?.email}</p>
            <p>ID Token: {session?.idToken}</p>
        </div>
    );
}
