// components/PivotWrapper.jsx

'use client';

import React, { useRef, useEffect, useState } from 'react';
import 'pivottable/dist/pivot.css';

import * as Plotly from 'plotly.js-basic-dist';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

/**
 * Componente final que asume que jQuery y Pivottable se cargan globalmente.
 */
const PivotWrapper = ({ dataSource }) => {
    const pivotRef = useRef(null);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [aggregatorOptions, setAggregatorOptions] = useState([]);

    const { data, defaultRows, defaultCols, defaultVals, defaultAggregator } = dataSource;

    // Estados de configuración de la tabla
    const [rows, setRows] = useState(defaultRows);
    const [cols, setCols] = useState(defaultCols);
    const [aggregatorName, setAggregatorName] = useState(defaultAggregator);
    const [vals, setVals] = useState(defaultVals);

    const allAttributes = Object.keys(data[0] || {});

    // ----------------------------------------------------------------------
    // 1. Verificación de Scripts y Sincronización (Reemplaza el useEffect de carga)
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Función para verificar si los scripts están listos en el objeto global
        const checkReady = () => {
            // Verificamos si jQuery y la función pivot están disponibles
            if (window.jQuery && window.jQuery.fn.pivot) {
                setScriptsLoaded(true);

                // Llenamos las opciones del Agregador.
                try {
                    const aggregators = window.jQuery.pivotUtilities.aggregators;
                    const keys = Object.keys(aggregators);
                    setAggregatorOptions(keys);
                    console.log("✅ Opciones de Agregación cargadas:", keys);
                } catch (e) {
                    console.error("❌ Fallo al acceder a $.pivotUtilities.aggregators.");
                }
            } else {
                // Seguimos intentando hasta que el navegador termine la carga global
                setTimeout(checkReady, 50);
            }
        };

        checkReady();

        // No hay función de limpieza (return) porque los scripts se cargan globalmente.
    }, []);

    // ----------------------------------------------------------------------
    // 2. Reinicio de Estados al cambiar la Fuente de Datos
    // ----------------------------------------------------------------------
    useEffect(() => {
        setRows(dataSource.defaultRows);
        setCols(dataSource.defaultCols);
        setAggregatorName(dataSource.defaultAggregator);
        setVals(dataSource.defaultVals);

        if (pivotRef.current) pivotRef.current.innerHTML = '';

    }, [dataSource]);

    // ----------------------------------------------------------------------
    // 3. Inicialización o Actualización de la tabla (Renderizado)
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (scriptsLoaded && pivotRef.current && window.jQuery) {

            if (rows.length === 0 && cols.length === 0) {
                if (pivotRef.current) pivotRef.current.innerHTML = '<div class="p-4 text-center text-gray-500">Selecciona Filas y/o Columnas para ver la tabla.</div>';
                return;
            }

            try {
                const $ = window.jQuery;
                const pivotUtilities = $.pivotUtilities;

                const TableRenderers = pivotUtilities.renderers;
                const aggregators = pivotUtilities.aggregators;
                const PlotlyRenderers = createPlotlyRenderers(Plotly);

                $(pivotRef.current).empty();

                $(pivotRef.current).pivot(dataSource.data, {
                    rows: rows,
                    cols: cols,
                    aggregatorName: aggregatorName,
                    vals: vals,

                    rendererName: "Tabla",

                    renderers: Object.assign({}, TableRenderers, PlotlyRenderers),
                    aggregators: aggregators,
                });
                console.log("✅ Tabla renderizada con éxito.");

            } catch (e) {
                console.error("❌ Fallo en la inicialización de Pivottable (método .pivot()):", e);
            }
        }
    }, [scriptsLoaded, dataSource, rows, cols, aggregatorName, vals]);

    // ----------------------------------------------------------------------
    // 4. Renderizado de la UI de Control y la Tabla
    // ----------------------------------------------------------------------
    return (
        <div className="p-4 border rounded-lg bg-gray-50">

            <div className="flex flex-wrap gap-4 mb-4 items-center">

                <ControlSelect
                    label="Filas"
                    options={allAttributes}
                    currentValue={rows[0] || ''}
                    onChange={(val) => setRows(val ? [val] : [])}
                />

                <ControlSelect
                    label="Columnas"
                    options={allAttributes}
                    currentValue={cols[0] || ''}
                    onChange={(val) => setCols(val ? [val] : [])}
                />

                <ControlSelect
                    label="Valores (Métrica)"
                    options={allAttributes.filter(a => typeof dataSource.data[0][a] === 'number' || a === vals[0])}
                    currentValue={vals[0] || ''}
                    onChange={(val) => setVals(val ? [val] : [])}
                />

                <ControlSelect
                    label="Operación"
                    options={aggregatorOptions}
                    currentValue={aggregatorName}
                    onChange={setAggregatorName}
                    disabled={aggregatorOptions.length === 0}
                />
            </div>

            {/* Contenedor de la tabla inyectada */}
            <div
                ref={pivotRef}
                className="overflow-x-auto"
                style={{ opacity: scriptsLoaded ? 1 : 0, transition: 'opacity 0.5s', minHeight: '300px' }}
            >
                {!scriptsLoaded && (
                    <div className="text-center p-10">Cargando interfaz de análisis...</div>
                )}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Componente Auxiliar (ControlSelect)
// ----------------------------------------------------------------------

const ControlSelect = ({ label, options, currentValue, onChange, disabled }) => {
    const displayOptions = options || [];
    const hasOptions = displayOptions.length > 0;

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">{label}</label>
            <select
                className="p-2 border border-gray-300 rounded-md text-sm"
                value={currentValue}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || !hasOptions}
            >
                <option value="">{hasOptions ? '-- Seleccionar --' : 'Cargando...'}</option>
                {displayOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
};


export default PivotWrapper;