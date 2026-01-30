"use client";

import { useState, useEffect } from "react";

// Definimos la interfaz para el tipo de datos que esperamos
interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

export default function UsersTable() {
    // Tipamos el estado para que sea un array de objetos de tipo User
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                // Aseguramos que los datos obtenidos coinciden con el tipo User[]
                const data: User[] = await response.json();
                setUsers(data);
            } catch (err) {
                // El error puede ser de tipo 'unknown' en TypeScript, así que lo convertimos a un string
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ha ocurrido un error inesperado.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p>Cargando datos de usuarios...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error al cargar los datos: {error}</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
            <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}