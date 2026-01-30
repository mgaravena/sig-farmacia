'use client';

import { useState } from 'react';
import { GripVertical, X, Table as TableIcon, Columns } from 'lucide-react';

export default function DynamicTable() {
    // Datos de ejemplo - aquí conectarías con Supabase
    const sampleData = [
        { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', edad: 28, ciudad: 'Buenos Aires', puesto: 'Desarrollador' },
        { id: 2, nombre: 'María García', email: 'maria@email.com', edad: 32, ciudad: 'Córdoba', puesto: 'Diseñadora' },
        { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', edad: 25, ciudad: 'Rosario', puesto: 'Analista' },
        { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', edad: 30, ciudad: 'Mendoza', puesto: 'Project Manager' },
        { id: 5, nombre: 'Pedro Rodríguez', email: 'pedro@email.com', edad: 35, ciudad: 'La Plata', puesto: 'DevOps' },
    ];

    // Definición de todas las columnas disponibles
    const allColumns = [
        { key: 'id', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'email', label: 'Email' },
        { key: 'edad', label: 'Edad' },
        { key: 'ciudad', label: 'Ciudad' },
        { key: 'puesto', label: 'Puesto' },
    ];

    // Estado: columnas activas (mostradas en la tabla)
    const [activeColumns, setActiveColumns] = useState(['id', 'nombre', 'email']);

    // Estado: columnas disponibles (no mostradas)
    const [availableColumns, setAvailableColumns] = useState(
        allColumns.filter(col => !activeColumns.includes(col.key))
    );

    const [draggedItem, setDraggedItem] = useState(null);
    const [dragSource, setDragSource] = useState(null);

    // Handlers de drag and drop
    const handleDragStart = (e, columnKey, source) => {
        setDraggedItem(columnKey);
        setDragSource(source);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropOnActive = (e) => {
        e.preventDefault();

        if (dragSource === 'available') {
            // Mover de disponibles a activas
            setActiveColumns([...activeColumns, draggedItem]);
            setAvailableColumns(availableColumns.filter(col => col.key !== draggedItem));
        }

        setDraggedItem(null);
        setDragSource(null);
    };

    const handleDropOnAvailable = (e) => {
        e.preventDefault();

        if (dragSource === 'active') {
            // Mover de activas a disponibles
            const column = allColumns.find(col => col.key === draggedItem);
            setAvailableColumns([...availableColumns, column]);
            setActiveColumns(activeColumns.filter(key => key !== draggedItem));
        }

        setDraggedItem(null);
        setDragSource(null);
    };

    const removeColumn = (columnKey) => {
        const column = allColumns.find(col => col.key === columnKey);
        setAvailableColumns([...availableColumns, column]);
        setActiveColumns(activeColumns.filter(key => key !== columnKey));
    };

    const addColumn = (columnKey) => {
        setActiveColumns([...activeColumns, columnKey]);
        setAvailableColumns(availableColumns.filter(col => col.key !== columnKey));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Tabla con Columnas Dinámicas</h1>

                <div className="grid grid-cols-12 gap-6">
                    {/* Panel lateral - Columnas disponibles */}
                    <div className="col-span-3">
                        <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                                <Columns className="w-5 h-5 text-blue-600" />
                                <h2 className="font-semibold text-gray-700">Columnas Disponibles</h2>
                            </div>

                            <div
                                className="space-y-2 min-h-[200px] bg-gray-50 rounded p-3 border-2 border-dashed border-gray-300"
                                onDragOver={handleDragOver}
                                onDrop={handleDropOnAvailable}
                            >
                                {availableColumns.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-8">
                                        Todas las columnas están activas
                                    </p>
                                ) : (
                                    availableColumns.map(column => (
                                        <div
                                            key={column.key}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, column.key, 'available')}
                                            onClick={() => addColumn(column.key)}
                                            className="flex items-center gap-2 bg-white p-3 rounded border border-gray-200 cursor-move hover:border-blue-400 hover:shadow-md transition-all"
                                        >
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700">{column.label}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Arrastra o haz clic para agregar
                            </p>
                        </div>
                    </div>

                    {/* Panel principal - Tabla */}
                    <div className="col-span-9">
                        {/* Zona de columnas activas */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                                <TableIcon className="w-5 h-5 text-green-600" />
                                <h2 className="font-semibold text-gray-700">Columnas Activas</h2>
                            </div>

                            <div
                                className="flex flex-wrap gap-2 min-h-[60px] bg-green-50 rounded p-3 border-2 border-dashed border-green-300"
                                onDragOver={handleDragOver}
                                onDrop={handleDropOnActive}
                            >
                                {activeColumns.length === 0 ? (
                                    <p className="text-sm text-gray-400 w-full text-center py-4">
                                        Arrastra columnas aquí para mostrarlas
                                    </p>
                                ) : (
                                    activeColumns.map(columnKey => {
                                        const column = allColumns.find(col => col.key === columnKey);
                                        return (
                                            <div
                                                key={columnKey}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, columnKey, 'active')}
                                                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-full text-sm font-medium cursor-move hover:bg-green-700 transition-colors"
                                            >
                                                <GripVertical className="w-4 h-4" />
                                                <span>{column?.label}</span>
                                                <button
                                                    onClick={() => removeColumn(columnKey)}
                                                    className="ml-1 hover:bg-green-800 rounded-full p-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Tabla de datos */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b">
                                    <tr>
                                        {activeColumns.map(columnKey => {
                                            const column = allColumns.find(col => col.key === columnKey);
                                            return (
                                                <th
                                                    key={columnKey}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                                >
                                                    {column?.label}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {sampleData.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                            {activeColumns.map(columnKey => (
                                                <td
                                                    key={`${row.id}-${columnKey}`}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                                >
                                                    {row[columnKey]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {activeColumns.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <TableIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>Selecciona columnas para ver los datos</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}