"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando...</p>
            </div>
        );
    }

    if (!session) {
        redirect("/auth/login");
    }

    const components = [
        {
            name: "Table View",
            description: "Tabla dinámica básica con funcionalidades de visualización",
            href: "/dashboard/table",
            color: "bg-blue-500",
        },
        {
            name: "Lucile Table",
            description: "Implementación avanzada con Lucile - drag & drop optimizado",
            href: "/dashboard/lucile",
            color: "bg-purple-500",
        },
        {
            name: "Pivot Table",
            description: "Tabla pivot con drag & drop para análisis de datos",
            href: "/dashboard/pivot",
            color: "bg-green-500",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center px-5">
                <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="font-semibold text-lg">FarmaPlus Dashboard</h1>
                    <div className="flex items-center gap-4">
            <span className="text-sm">
              Hola, {session.user.name || session.user.email}
            </span>
<a
                        href="/"
                        className="text-sm text-foreground/60 hover:text-foreground"
                        >
                        Volver al inicio
                    </a>
                </div>
        </div>
</nav>

    <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Bienvenido al Dashboard</h2>
            <p className="text-foreground/60">
                Selecciona un componente para empezar
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
                <Link
                    key={component.href}
                    href={component.href}
                    className="group block"
                >
                    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className={`w-12 h-12 ${component.color} rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl`}>
                            {component.name.charAt(0)}
                        </div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {component.name}
                        </h3>
                        <p className="text-sm text-foreground/60 flex-1">
                            {component.description}
                        </p>
                        <div className="mt-4 text-sm text-blue-600 group-hover:underline">
                            Abrir →
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </main>
</div>
);
}