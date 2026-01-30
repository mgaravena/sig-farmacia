// components/ReporteTest.tsx
'use client'; // Indica que es un Client Component

import React, { useState, useEffect } from 'react';

// Tipado básico de los datos que esperamos del backend
interface Empleado {
    id: number;
    nombre: string;
    departamento: string;
    estado: string;
}

export default function ReporteTest() {
    const [data, setData] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Función para obtener los datos de la API Route
        async function fetchData() {
            try {
                const response = await fetch('/api/test-hosting'); // Llama a tu endpoint de hosting

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result: Empleado[] = await response.json();
                setData(result);
            } catch (err) {
                console.error("Fallo al cargar los datos:", err);
                setError("No se pudieron cargar los datos del reporte.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []); // El array vacío [] asegura que solo se ejecute una vez al cargar

    // Lógica de visualización:
    if (loading) return <p>Cargando datos del reporte...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (data.length === 0) return <p>No se encontraron empleados de prueba.</p>;

    return (
        <div>
            <h2>Reporte de Empleados (Conexión Exitosa)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Departamento</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Estado</th>
                </tr>
                </thead>
                <tbody>
                {data.map((empleado) => (
                    <tr key={empleado.id}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.id}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.nombre}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{empleado.departamento}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', color: empleado.estado === 'Activo' ? 'green' : 'red' }}>
                            {empleado.estado}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}