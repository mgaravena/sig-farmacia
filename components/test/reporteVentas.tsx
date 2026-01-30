// components//test/ReporteVentas.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Tipado de los datos que esperamos del backend
interface ClienteVenta {
    customerId: number;
    customerName: string;
    mail: string;
    totalSalesCount: number;
    totalSalesAmount: string; // Es string porque 'amount' es varchar(45) en la DB
}

export default function ReporteVentas() {
    const [data, setData] = useState<ClienteVenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Llama al nuevo endpoint de ventas
                const response = await fetch('/api/reporte-ventas');

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result: ClienteVenta[] = await response.json();
                setData(result);
            } catch (err) {
                console.error("Fallo al cargar los datos de ventas:", err);
                setError("No se pudieron cargar los datos de Ventas. Verifique la conexión o el SQL.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Función para formatear el monto como moneda
    const formatAmount = (amount: string) => {
        const num = parseFloat(amount);
        return isNaN(num) ? 'N/A' : num.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    };

    // Lógica de visualización:
    if (loading) return <p>Cargando reporte de ventas...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (data.length === 0) return <p>No se encontraron datos de ventas.</p>;

    return (
        <div>
            <h2>Reporte de Ventas por Cliente (Top 100)</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                <tr style={{ backgroundColor: '#fffbe6' }}>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID Cliente</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Total Ventas</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>Monto Total</th>
                </tr>
                </thead>
                <tbody>
                {data.map((cliente) => (
                    <tr key={cliente.customerId}>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cliente.customerId}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cliente.customerName}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{cliente.totalSalesCount}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>
                            {formatAmount(cliente.totalSalesAmount)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}