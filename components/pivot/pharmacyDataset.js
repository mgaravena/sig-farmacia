// Dataset de Sistema de Fidelización de Farmacias
// 32 registros con datos consistentes

export const pharmacyData = [
    // Farmacia Centro - Enero
    { id: 1, fecha_movimiento: '2024-01-05', comercio: 'Farmacia Centro', cliente: 'María González', dni_cliente: '32456789', categoria_cliente: 'Oro', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 150, puntos_canjeados: 0, total_venta: 1500, nro_ticket: 'FC-001', descuento_aplicado: 225 },
    { id: 2, fecha_movimiento: '2024-01-10', comercio: 'Farmacia Centro', cliente: 'Juan Pérez', dni_cliente: '28345678', categoria_cliente: 'Platino', tipo_movimiento: 'Compra', categoria_producto: 'Perfumería', puntos_emitidos: 280, puntos_canjeados: 0, total_venta: 2800, nro_ticket: 'FC-002', descuento_aplicado: 560 },
    { id: 3, fecha_movimiento: '2024-01-12', comercio: 'Farmacia Centro', cliente: 'Ana Martínez', dni_cliente: '35678901', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 120, puntos_canjeados: 0, total_venta: 1200, nro_ticket: 'FC-003', descuento_aplicado: 120 },
    { id: 4, fecha_movimiento: '2024-01-15', comercio: 'Farmacia Centro', cliente: 'Carlos López', dni_cliente: '30123456', categoria_cliente: 'Bronce', tipo_movimiento: 'Compra', categoria_producto: 'Ortopedia', puntos_emitidos: 85, puntos_canjeados: 0, total_venta: 850, nro_ticket: 'FC-004', descuento_aplicado: 43 },
    { id: 5, fecha_movimiento: '2024-01-18', comercio: 'Farmacia Centro', cliente: 'María González', dni_cliente: '32456789', categoria_cliente: 'Oro', tipo_movimiento: 'Canje', categoria_producto: 'Perfumería', puntos_emitidos: 0, puntos_canjeados: 200, total_venta: 0, nro_ticket: 'FC-005', descuento_aplicado: 0 },
    { id: 6, fecha_movimiento: '2024-01-20', comercio: 'Farmacia Centro', cliente: 'Juan Pérez', dni_cliente: '28345678', categoria_cliente: 'Platino', tipo_movimiento: 'Ajuste', categoria_producto: 'N/A', puntos_emitidos: 50, puntos_canjeados: 0, total_venta: 0, nro_ticket: 'FC-006', descuento_aplicado: 0 },
    { id: 7, fecha_movimiento: '2024-01-22', comercio: 'Farmacia Centro', cliente: 'Laura Sánchez', dni_cliente: '33567890', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Dermocosmetica', puntos_emitidos: 195, puntos_canjeados: 0, total_venta: 1950, nro_ticket: 'FC-007', descuento_aplicado: 195 },
    { id: 8, fecha_movimiento: '2024-01-25', comercio: 'Farmacia Centro', cliente: 'Pedro Ruiz', dni_cliente: '29876543', categoria_cliente: 'Bronce', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 65, puntos_canjeados: 0, total_venta: 650, nro_ticket: 'FC-008', descuento_aplicado: 33 },
    
    // Farmacia Norte - Enero-Febrero
    { id: 9, fecha_movimiento: '2024-01-08', comercio: 'Farmacia Norte', cliente: 'Roberto Díaz', dni_cliente: '31234567', categoria_cliente: 'Oro', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 220, puntos_canjeados: 0, total_venta: 2200, nro_ticket: 'FN-001', descuento_aplicado: 330 },
    { id: 10, fecha_movimiento: '2024-01-14', comercio: 'Farmacia Norte', cliente: 'Silvia Torres', dni_cliente: '34567890', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Perfumería', puntos_emitidos: 180, puntos_canjeados: 0, total_venta: 1800, nro_ticket: 'FN-002', descuento_aplicado: 180 },
    { id: 11, fecha_movimiento: '2024-01-19', comercio: 'Farmacia Norte', cliente: 'Miguel Fernández', dni_cliente: '27654321', categoria_cliente: 'Bronce', tipo_movimiento: 'Compra', categoria_producto: 'Ortopedia', puntos_emitidos: 95, puntos_canjeados: 0, total_venta: 950, nro_ticket: 'FN-003', descuento_aplicado: 48 },
    { id: 12, fecha_movimiento: '2024-01-23', comercio: 'Farmacia Norte', cliente: 'Roberto Díaz', dni_cliente: '31234567', categoria_cliente: 'Oro', tipo_movimiento: 'Canje', categoria_producto: 'Medicamentos', puntos_emitidos: 0, puntos_canjeados: 300, total_venta: 0, nro_ticket: 'FN-004', descuento_aplicado: 0 },
    { id: 13, fecha_movimiento: '2024-02-02', comercio: 'Farmacia Norte', cliente: 'Silvia Torres', dni_cliente: '34567890', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Dermocosmetica', puntos_emitidos: 210, puntos_canjeados: 0, total_venta: 2100, nro_ticket: 'FN-005', descuento_aplicado: 210 },
    { id: 14, fecha_movimiento: '2024-02-08', comercio: 'Farmacia Norte', cliente: 'Elena Castro', dni_cliente: '36789012', categoria_cliente: 'Oro', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 175, puntos_canjeados: 0, total_venta: 1750, nro_ticket: 'FN-006', descuento_aplicado: 263 },
    { id: 15, fecha_movimiento: '2024-02-12', comercio: 'Farmacia Norte', cliente: 'Miguel Fernández', dni_cliente: '27654321', categoria_cliente: 'Bronce', tipo_movimiento: 'Ajuste', categoria_producto: 'N/A', puntos_emitidos: 30, puntos_canjeados: 0, total_venta: 0, nro_ticket: 'FN-007', descuento_aplicado: 0 },
    
    // Farmacia Sur - Febrero-Marzo
    { id: 16, fecha_movimiento: '2024-02-05', comercio: 'Farmacia Sur', cliente: 'Gabriela Moreno', dni_cliente: '33345678', categoria_cliente: 'Platino', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 340, puntos_canjeados: 0, total_venta: 3400, nro_ticket: 'FS-001', descuento_aplicado: 680 },
    { id: 17, fecha_movimiento: '2024-02-09', comercio: 'Farmacia Sur', cliente: 'Ricardo Vega', dni_cliente: '29567890', categoria_cliente: 'Oro', tipo_movimiento: 'Compra', categoria_producto: 'Perfumería', puntos_emitidos: 260, puntos_canjeados: 0, total_venta: 2600, nro_ticket: 'FS-002', descuento_aplicado: 390 },
    { id: 18, fecha_movimiento: '2024-02-13', comercio: 'Farmacia Sur', cliente: 'Patricia Rojas', dni_cliente: '32678901', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Dermocosmetica', puntos_emitidos: 140, puntos_canjeados: 0, total_venta: 1400, nro_ticket: 'FS-003', descuento_aplicado: 140 },
    { id: 19, fecha_movimiento: '2024-02-16', comercio: 'Farmacia Sur', cliente: 'Fernando Paz', dni_cliente: '28890123', categoria_cliente: 'Bronce', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 75, puntos_canjeados: 0, total_venta: 750, nro_ticket: 'FS-004', descuento_aplicado: 38 },
    { id: 20, fecha_movimiento: '2024-02-20', comercio: 'Farmacia Sur', cliente: 'Gabriela Moreno', dni_cliente: '33345678', categoria_cliente: 'Platino', tipo_movimiento: 'Canje', categoria_producto: 'Perfumería', puntos_emitidos: 0, puntos_canjeados: 400, total_venta: 0, nro_ticket: 'FS-005', descuento_aplicado: 0 },
    { id: 21, fecha_movimiento: '2024-03-01', comercio: 'Farmacia Sur', cliente: 'Ricardo Vega', dni_cliente: '29567890', categoria_cliente: 'Oro', tipo_movimiento: 'Compra', categoria_producto: 'Ortopedia', puntos_emitidos: 310, puntos_canjeados: 0, total_venta: 3100, nro_ticket: 'FS-006', descuento_aplicado: 465 },
    { id: 22, fecha_movimiento: '2024-03-05', comercio: 'Farmacia Sur', cliente: 'Patricia Rojas', dni_cliente: '32678901', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 190, puntos_canjeados: 0, total_venta: 1900, nro_ticket: 'FS-007', descuento_aplicado: 190 },
    { id: 23, fecha_movimiento: '2024-03-08', comercio: 'Farmacia Sur', cliente: 'Fernando Paz', dni_cliente: '28890123', categoria_cliente: 'Bronce', tipo_movimiento: 'Ajuste', categoria_producto: 'N/A', puntos_emitidos: 20, puntos_canjeados: 0, total_venta: 0, nro_ticket: 'FS-008', descuento_aplicado: 0 },
    { id: 24, fecha_movimiento: '2024-03-12', comercio: 'Farmacia Sur', cliente: 'Claudia Herrera', dni_cliente: '35123456', categoria_cliente: 'Platino', tipo_movimiento: 'Compra', categoria_producto: 'Dermocosmetica', puntos_emitidos: 420, puntos_canjeados: 0, total_venta: 4200, nro_ticket: 'FS-009', descuento_aplicado: 840 },
    
    // Farmacia Centro - Marzo-Abril
    { id: 25, fecha_movimiento: '2024-03-15', comercio: 'Farmacia Centro', cliente: 'Ana Martínez', dni_cliente: '35678901', categoria_cliente: 'Plata', tipo_movimiento: 'Canje', categoria_producto: 'Perfumería', puntos_emitidos: 0, puntos_canjeados: 150, total_venta: 0, nro_ticket: 'FC-009', descuento_aplicado: 0 },
    { id: 26, fecha_movimiento: '2024-03-18', comercio: 'Farmacia Centro', cliente: 'Juan Pérez', dni_cliente: '28345678', categoria_cliente: 'Platino', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 380, puntos_canjeados: 0, total_venta: 3800, nro_ticket: 'FC-010', descuento_aplicado: 760 },
    { id: 27, fecha_movimiento: '2024-03-22', comercio: 'Farmacia Centro', cliente: 'Carlos López', dni_cliente: '30123456', categoria_cliente: 'Bronce', tipo_movimiento: 'Compra', categoria_producto: 'Perfumería', puntos_emitidos: 55, puntos_canjeados: 0, total_venta: 550, nro_ticket: 'FC-011', descuento_aplicado: 28 },
    { id: 28, fecha_movimiento: '2024-04-02', comercio: 'Farmacia Centro', cliente: 'María González', dni_cliente: '32456789', categoria_cliente: 'Oro', tipo_movimiento: 'Compra', categoria_producto: 'Ortopedia', puntos_emitidos: 245, puntos_canjeados: 0, total_venta: 2450, nro_ticket: 'FC-012', descuento_aplicado: 368 },
    { id: 29, fecha_movimiento: '2024-04-08', comercio: 'Farmacia Centro', cliente: 'Laura Sánchez', dni_cliente: '33567890', categoria_cliente: 'Plata', tipo_movimiento: 'Ajuste', categoria_producto: 'N/A', puntos_emitidos: 100, puntos_canjeados: 0, total_venta: 0, nro_ticket: 'FC-013', descuento_aplicado: 0 },
    
    // Farmacia Norte - Abril
    { id: 30, fecha_movimiento: '2024-04-05', comercio: 'Farmacia Norte', cliente: 'Elena Castro', dni_cliente: '36789012', categoria_cliente: 'Oro', tipo_movimiento: 'Canje', categoria_producto: 'Dermocosmetica', puntos_emitidos: 0, puntos_canjeados: 300, total_venta: 0, nro_ticket: 'FN-008', descuento_aplicado: 0 },
    { id: 31, fecha_movimiento: '2024-04-10', comercio: 'Farmacia Norte', cliente: 'Silvia Torres', dni_cliente: '34567890', categoria_cliente: 'Plata', tipo_movimiento: 'Compra', categoria_producto: 'Medicamentos', puntos_emitidos: 165, puntos_canjeados: 0, total_venta: 1650, nro_ticket: 'FN-009', descuento_aplicado: 165 },
    { id: 32, fecha_movimiento: '2024-04-15', comercio: 'Farmacia Sur', cliente: 'Gabriela Moreno', dni_cliente: '33345678', categoria_cliente: 'Platino', tipo_movimiento: 'Ajuste', categoria_producto: 'N/A', puntos_emitidos: 300, puntos_canjeados: 0, total_venta: 0, nro_ticket: 'FS-010', descuento_aplicado: 0 },
];

// Campos disponibles con metadatos
export const pharmacyFields = [
    { key: 'fecha_movimiento', label: 'Fecha', type: 'date' },
    { key: 'comercio', label: 'Comercio', type: 'string' },
    { key: 'cliente', label: 'Cliente', type: 'string' },
    { key: 'dni_cliente', label: 'DNI', type: 'string' },
    { key: 'categoria_cliente', label: 'Categoría Cliente', type: 'string' },
    { key: 'tipo_movimiento', label: 'Tipo Movimiento', type: 'string' },
    { key: 'categoria_producto', label: 'Categoría Producto', type: 'string' },
    { key: 'puntos_emitidos', label: 'Puntos Emitidos', type: 'number' },
    { key: 'puntos_canjeados', label: 'Puntos Canjeados', type: 'number' },
    { key: 'total_venta', label: 'Total Venta', type: 'number' },
    { key: 'nro_ticket', label: 'Nro. Ticket', type: 'string' },
    { key: 'descuento_aplicado', label: 'Descuento', type: 'number' },
];

// Metadata del programa de fidelización
export const loyaltyProgramInfo = {
    name: 'Programa FarmaPlus',
    pointsRule: 'Acumula 1 punto cada $10 de compra',
    categories: [
        { name: 'Bronce', range: '0-500 pts', discount: '5%', color: '#CD7F32' },
        { name: 'Plata', range: '501-1500 pts', discount: '10%', color: '#C0C0C0' },
        { name: 'Oro', range: '1501-3000 pts', discount: '15%', color: '#FFD700' },
        { name: 'Platino', range: '+3000 pts', discount: '20%', color: '#E5E4E2' },
    ],
    redemption: '100 puntos = $50 de descuento'
};
