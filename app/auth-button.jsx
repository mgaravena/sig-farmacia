"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="text-sm">Cargando...</div>;
    }

    if (session) {
        return (
            <div className="flex items-center gap-4">
        <span className="text-sm">
          Hola, {session.user.name || session.user.email}
        </span>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="py-2 px-4 rounded-md bg-btn-background hover:bg-btn-background-hover text-sm"
                >
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <Link
                href="/auth/login"
                className="py-2 px-3 flex rounded-md bg-btn-background hover:bg-btn-background-hover text-sm"
            >
                Iniciar Sesión
            </Link>
            <Link
                href="/auth/sign-up"
                className="py-2 px-3 flex rounded-md bg-foreground text-background hover:bg-foreground/90 text-sm"
            >
                Registrarse
            </Link>
        </div>
    );
}