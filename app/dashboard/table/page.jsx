"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import TableView from "@/components/table/view";

export default function TablePage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center px-5">
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm text-foreground/60 hover:text-foreground">
                            ← Dashboard
                        </Link>
                        <h1 className="font-semibold text-lg">Table View</h1>
                    </div>
                    <span className="text-sm">
            {session.user.name || session.user.email}
          </span>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-7xl mx-auto p-6">
                <TableView />
            </main>
        </div>
    );
}