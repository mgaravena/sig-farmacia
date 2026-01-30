// utils/demoData.js

// 1. Datos de Ventas
const salesData = [
    { 'País': 'Argentina', 'Ciudad': 'Buenos Aires', 'Ventas': 1500, 'Mes': 'Enero', 'Categoría': 'Electrónica', 'Margen': 0.15 },
    { 'País': 'Chile', 'Ciudad': 'Santiago', 'Ventas': 2200, 'Mes': 'Enero', 'Categoría': 'Ropa', 'Margen': 0.20 },
    { 'País': 'Perú', 'Ciudad': 'Lima', 'Ventas': 3000, 'Mes': 'Febrero', 'Categoría': 'Alimentos', 'Margen': 0.10 },
    { 'País': 'Argentina', 'Ciudad': 'Córdoba', 'Ventas': 800, 'Mes': 'Febrero', 'Categoría': 'Electrónica', 'Margen': 0.15 },
    { 'País': 'Chile', 'Ciudad': 'Valparaíso', 'Ventas': 1100, 'Mes': 'Marzo', 'Categoría': 'Ropa', 'Margen': 0.20 },
];

// 2. Datos de Empleados
const employeeData = [
    { 'Departamento': 'Ventas', 'Rol': 'Manager', 'Salario': 75000, 'Antigüedad': 5, 'Edad': 45 },
    { 'Departamento': 'IT', 'Rol': 'Developer', 'Salario': 60000, 'Antigüedad': 3, 'Edad': 30 },
    { 'Departamento': 'Ventas', 'Rol': 'Asociado', 'Salario': 45000, 'Antigüedad': 2, 'Edad': 25 },
    { 'Departamento': 'RRHH', 'Rol': 'Manager', 'Salario': 80000, 'Antigüedad': 10, 'Edad': 55 },
];

// 3. Datos de Logística
const logisticsData = [
    { 'Región': 'Norte', 'Estado': 'Entregado', 'TiempoEnvio': 5, 'Costo': 15, 'Transporte': 'Aéreo' },
    { 'Región': 'Sur', 'Estado': 'Pendiente', 'TiempoEnvio': 8, 'Costo': 25, 'Transporte': 'Marítimo' },
    { 'Región': 'Norte', 'Estado': 'Entregado', 'TiempoEnvio': 3, 'Costo': 10, 'Transporte': 'Terrestre' },
    { 'Región': 'Centro', 'Estado': 'Devuelto', 'TiempoEnvio': 12, 'Costo': 30, 'Transporte': 'Aéreo' },
];

export const dataSources = {
    'Ventas': {
        data: salesData,
        name: 'Análisis de Ventas',
        defaultRows: ['País'],
        defaultCols: ['Mes'],
        defaultVals: ['Ventas'],
        defaultAggregator: 'Suma'
    },
    'Empleados': {
        data: employeeData,
        name: 'Nómina y RRHH',
        defaultRows: ['Departamento'],
        defaultCols: ['Rol'],
        defaultVals: ['Salario'],
        defaultAggregator: 'Promedio'
    },
    'Logística': {
        data: logisticsData,
        name: 'Tiempos y Costos de Envío',
        defaultRows: ['Región'],
        defaultCols: ['Estado'],
        defaultVals: ['TiempoEnvio'],
        defaultAggregator: 'Mínimo'
    }
};

export const sourceKeys = Object.keys(dataSources);