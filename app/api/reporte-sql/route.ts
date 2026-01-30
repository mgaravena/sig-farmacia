// app/api/reporte-sql/route.ts

import { createPool } from 'mysql2/promise';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// 1. Configuración del Pool para MySQL/MariaDB
const pool = createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: parseInt(process.env.SQL_PORT || '3306', 10), // Usamos 3307 del .env
    waitForConnections: true,
    connectionLimit: 10,
});

export async function GET() {
    let connection;
    try {
        // 2. Obtener una conexión del pool
        connection = await pool.getConnection();

        // 3. Ejecutar una consulta de prueba o tu consulta compleja
        // NOTA: Esta es una consulta SQL genérica. Reemplázala con tu SELECT real si tienes una.
        const [rows] = await connection.execute('SELECT 1 + 1 AS result, NOW() AS server_time;');

        // 4. Devolver los resultados al frontend
        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error al manejar la solicitud SQL:', error);

        // El error de autenticación en MySQL puede ser: Access denied for user...
        return NextResponse.json({
            message: 'Error interno del servidor SQL.',
            error: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });

    } finally {
        // 5. Liberar la conexión
        if (connection) {
            connection.release();
        }
    }
}