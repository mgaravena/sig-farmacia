// app/api/test-hosting/route.ts

import { createPool } from 'mysql2/promise';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// 1. Configuración del Pool usando las variables del hosting
const pool = createPool({
    host: process.env.HOSTING_DB_HOST,
    user: process.env.HOSTING_DB_USER,
    password: process.env.HOSTING_DB_PASSWORD,
    database: process.env.HOSTING_DB_DATABASE,
    port: parseInt(process.env.HOSTING_DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
});

export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection();

        // 2. Consulta simple para obtener los datos de prueba
        const [rows] = await connection.execute('SELECT id, nombre, departamento, estado FROM empleados;');

        // 3. Devolver los resultados al frontend
        return NextResponse.json(rows, { status: 200 });

    } catch (error) {
        console.error('Error de conexión con el hosting/phpMyAdmin:', error);

        return NextResponse.json({
            message: 'Error de conexión con la base de datos de hosting. Revise credenciales.',
            error: error instanceof Error ? error.message : 'Error desconocido'
        }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}