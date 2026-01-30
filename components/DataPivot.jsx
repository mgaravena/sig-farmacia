// components/DataPivot.jsx (El componente principal)

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { dataSources, sourceKeys } from '../utils/demoData'; // Importamos las fuentes

// La carga dinámica se mantiene igual
const PivotWrapper = dynamic(
    () => import('./PivotWrapper'),
    {
        ssr: false,
        loading: () => <div className="text-center p-10">Cargando motor de análisis...</div>
    }
);

const DataPivot = () => {
    // Estado para seleccionar la fuente de datos. Iniciamos con 'Ventas'.
    const [selectedKey, setSelectedKey] = useState('Ventas');

    // Obtenemos el objeto de datos actual
    const currentSource = dataSources[selectedKey];

    const handleSourceChange = (event) => {
        setSelectedKey(event.target.value);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Demo de Análisis con Pivottable</h1>

            {/* 🔑 SELECTOR DE FUENTE DE DATOS */}
            <div className="mb-6 flex items-center space-x-4">
                <label htmlFor="dataSourceSelect" className="font-semibold">
                    Seleccionar Fuente:
                </label>
                <select
                    id="dataSourceSelect"
                    value={selectedKey}
                    onChange={handleSourceChange}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    {sourceKeys.map(key => (
                        <option key={key} value={key}>
                            {dataSources[key].name}
                        </option>
                    ))}
                </select>
            </div>

            <p className="mb-4 text-gray-700">Fuente Actual: <strong>{currentSource.name}</strong></p>

            {/* Renderiza el componente dinámico, pasándole TODA la fuente de datos */}
            <PivotWrapper dataSource={currentSource} />
        </div>
    );
}

export default DataPivot;