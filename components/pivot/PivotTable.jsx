'use client';

import { useState, useEffect } from 'react';
import { Database, Settings, Table, TrendingUp, BarChart3, Download, ChevronDown, ChevronUp, ChevronRight, Maximize2, Minimize2, Filter, X, AlertCircle } from 'lucide-react';
import FieldList from './FieldList';
import DropZone from './DropZone';
import ThemeToggle from './ThemeToggle';
import { pharmacyData, pharmacyFields, loyaltyProgramInfo } from './pharmacyDataset';
import { processPivotData, formatValue, calculateStats, exportToCSV, getUniqueValues } from './utils/pivotCalculations';

export default function PivotTable() {
    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);
    const [vals, setVals] = useState([]);
    const [filters, setFilters] = useState([]);
    const [aggregator, setAggregator] = useState('sum');
    const [draggedField, setDraggedField] = useState(null);
    const [pivotResult, setPivotResult] = useState(null);
    const [stats, setStats] = useState(null);
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);
    const [collapsedGroups, setCollapsedGroups] = useState(new Set());
    
    // Estado de filtros
    const [filterValues, setFilterValues] = useState({});
    
    // Estado de subtotales
    const [showSubtotals, setShowSubtotals] = useState(true);

    const aggregators = [
        { key: 'sum', label: 'Suma' },
        { key: 'count', label: 'Contar' },
        { key: 'avg', label: 'Promedio' },
        { key: 'min', label: 'Mínimo' },
        { key: 'max', label: 'Máximo' },
    ];

    useEffect(() => {
        if (rows.length > 0 || cols.length > 0 || vals.length > 0) {
            const result = processPivotData(
                pharmacyData,
                rows,
                cols,
                vals,
                aggregator,
                filters,
                filterValues
            );
            setPivotResult(result);
            setStats(calculateStats(result));
        } else {
            setPivotResult(null);
            setStats(null);
        }
    }, [rows, cols, vals, aggregator, filters, filterValues]);

    const handleDragStart = (e, field) => {
        setDraggedField(field);
        e.dataTransfer.setData('field', JSON.stringify(field));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDropRows = (e) => {
        e.preventDefault();
        const field = JSON.parse(e.dataTransfer.getData('field'));
        if (!rows.find(f => f.key === field.key)) {
            setRows([...rows, field]);
        }
        setDraggedField(null);
    };

    const handleDropCols = (e) => {
        e.preventDefault();
        const field = JSON.parse(e.dataTransfer.getData('field'));
        if (!cols.find(f => f.key === field.key)) {
            setCols([...cols, field]);
        }
        setDraggedField(null);
    };

    const handleDropVals = (e) => {
        e.preventDefault();
        const field = JSON.parse(e.dataTransfer.getData('field'));
        
        if (field.type !== 'number') {
            alert('⚠️ Solo puedes agregar campos numéricos a Valores');
            setDraggedField(null);
            return;
        }
        
        if (!vals.find(f => f.key === field.key)) {
            setVals([...vals, field]);
        }
        setDraggedField(null);
    };

    const handleDropFilters = (e) => {
        e.preventDefault();
        const field = JSON.parse(e.dataTransfer.getData('field'));
        if (!filters.find(f => f.key === field.key)) {
            setFilters([...filters, field]);
            // Inicializar valor del filtro en 'all'
            setFilterValues(prev => ({ ...prev, [field.key]: 'all' }));
        }
        setDraggedField(null);
    };

    const removeFromRows = (field, index) => setRows(rows.filter((_, i) => i !== index));
    const removeFromCols = (field, index) => setCols(cols.filter((_, i) => i !== index));
    const removeFromVals = (field, index) => setVals(vals.filter((_, i) => i !== index));
    const removeFromFilters = (field, index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
        // Limpiar valor del filtro
        const newFilterValues = { ...filterValues };
        delete newFilterValues[field.key];
        setFilterValues(newFilterValues);
    };

    const reorderRows = (fromIndex, toIndex) => {
        const newRows = [...rows];
        const [movedItem] = newRows.splice(fromIndex, 1);
        newRows.splice(toIndex, 0, movedItem);
        setRows(newRows);
    };

    const reorderCols = (fromIndex, toIndex) => {
        const newCols = [...cols];
        const [movedItem] = newCols.splice(fromIndex, 1);
        newCols.splice(toIndex, 0, movedItem);
        setCols(newCols);
    };

    const reorderVals = (fromIndex, toIndex) => {
        const newVals = [...vals];
        const [movedItem] = newVals.splice(fromIndex, 1);
        newVals.splice(toIndex, 0, movedItem);
        setVals(newVals);
    };

    const reorderFilters = (fromIndex, toIndex) => {
        const newFilters = [...filters];
        const [movedItem] = newFilters.splice(fromIndex, 1);
        newFilters.splice(toIndex, 0, movedItem);
        setFilters(newFilters);
    };

    const clearAllFields = () => {
        if (confirm('¿Deseas limpiar toda la configuración del pivot?')) {
            setRows([]);
            setCols([]);
            setVals([]);
            setFilters([]);
            setCollapsedGroups(new Set());
            setFilterValues({});
        }
    };

    const handleExport = () => {
        if (!pivotResult) return;
        const csv = exportToCSV(pivotResult);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pivot-table.csv';
        a.click();
    };

    const getConfigSummary = () => {
        const parts = [];
        if (rows.length > 0) parts.push(`📊 ${rows.map(f => f.label).join(' → ')}`);
        if (cols.length > 0) parts.push(`📊 ${cols.map(f => f.label).join(' → ')}`);
        if (vals.length > 0) parts.push(`🔢 ${vals.map(f => f.label).join(', ')} (${aggregators.find(a => a.key === aggregator)?.label})`);
        return parts.length > 0 ? parts.join(' × ') : 'Sin configuración';
    };

    // ==================== FUNCIONES DE FILTROS ====================

    const handleFilterChange = (fieldKey, value) => {
        setFilterValues(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    const resetFilters = () => {
        const resetValues = {};
        filters.forEach(filter => {
            resetValues[filter.key] = 'all';
        });
        setFilterValues(resetValues);
    };

    const getActiveFiltersCount = () => {
        return Object.values(filterValues).filter(v => v && v !== 'all').length;
    };

    const getFilteredRecordsCount = () => {
        if (filters.length === 0) return pharmacyData.length;
        
        const filtered = pharmacyData.filter(row => {
            return filters.every(filter => {
                const filterValue = filterValues[filter.key];
                if (!filterValue || filterValue === 'all') return true;
                return row[filter.key] === filterValue;
            });
        });
        
        return filtered.length;
    };

    // ==================== FIN FUNCIONES DE FILTROS ====================

    // ==================== FUNCIONES DE EXPAND/COLLAPSE ====================

    const getGroupKey = (row) => {
        return row.path ? row.path.join('|||') : row.value;
    };

    const toggleGroup = (row) => {
        const key = getGroupKey(row);
        const newCollapsed = new Set(collapsedGroups);
        
        if (newCollapsed.has(key)) {
            newCollapsed.delete(key);
        } else {
            newCollapsed.add(key);
        }
        
        setCollapsedGroups(newCollapsed);
    };

    const isGroupCollapsed = (row) => {
        const key = getGroupKey(row);
        return collapsedGroups.has(key);
    };

    const isRowVisible = (row, rowIndex) => {
        if (!pivotResult.hierarchyData) return true;
        
        // Ocultar subtotales si showSubtotals es false
        if (row.isSubtotal && !showSubtotals) {
            return false;
        }
        
        if (row.level === 0) return true;
        
        for (let i = rowIndex - 1; i >= 0; i--) {
            const ancestorRow = pivotResult.hierarchyData[i];
            
            if (ancestorRow.level < row.level) {
                if (isGroupCollapsed(ancestorRow) && !ancestorRow.isSubtotal) {
                    return false;
                }
                
                if (ancestorRow.level === 0) {
                    break;
                }
            }
        }
        
        return true;
    };

    const hasChildren = (row, rowIndex) => {
        if (!pivotResult.hierarchyData) return false;
        if (row.isSubtotal) return false;
        
        for (let i = rowIndex + 1; i < pivotResult.hierarchyData.length; i++) {
            const nextRow = pivotResult.hierarchyData[i];
            
            if (nextRow.level > row.level) {
                return true;
            }
            
            if (nextRow.level <= row.level) {
                break;
            }
        }
        
        return false;
    };

    const expandAll = () => {
        setCollapsedGroups(new Set());
    };

    const collapseAll = () => {
        if (!pivotResult || !pivotResult.hierarchyData) return;
        
        const allGroups = new Set();
        pivotResult.hierarchyData.forEach((row) => {
            if (!row.isSubtotal && row.level < rows.length - 1) {
                allGroups.add(getGroupKey(row));
            }
        });
        
        setCollapsedGroups(allGroups);
    };

    // ==================== FIN FUNCIONES DE EXPAND/COLLAPSE ====================

    const getLevelIcon = (level, isSubtotal) => {
        if (isSubtotal) return '├─';
        if (level === 0) return '📦';
        if (level === 1) return '💎';
        if (level === 2) return '👤';
        return '•';
    };

    const getRowStyle = (level, isSubtotal) => {
        if (isSubtotal) {
            return {
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                text: 'font-semibold text-gray-800 dark:text-white',
                paddingLeft: `${level * 1.5}rem`
            };
        }
        return {
            bg: level === 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800',
            text: level === 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300',
            paddingLeft: `${level * 1.5}rem`
        };
    };

    const renderColHeaders = () => {
        // CASO: Sin jerarquía de columnas
        if (!pivotResult.colHeadersHierarchy) {
            return (
                <tr className="bg-gray-100 dark:bg-gray-700">
                    {renderFirstColumnHeader()}
                    {pivotResult.colHeaders.map((header, i) => (
                        <th key={i} className="border border-gray-300 dark:border-gray-600 bg-blue-100 dark:bg-blue-900 px-4 py-3 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                            {header}
                        </th>
                    ))}
                    {shouldShowTotalColumn() && (
                        <th className="border border-gray-300 dark:border-gray-600 bg-green-100 dark:bg-green-900 px-4 py-3 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            TOTAL
                        </th>
                    )}
                </tr>
            );
        }

        // CASO: Con jerarquía de columnas
        return (
            <>
                {pivotResult.colHeadersHierarchy.map((headerRow, rowIndex) => (
                    <tr key={rowIndex} className="bg-gray-100 dark:bg-gray-700">
                        {rowIndex === 0 && (
                            <th 
                                rowSpan={pivotResult.colHeadersHierarchy.length} 
                                className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap bg-gray-50 dark:bg-gray-800"
                            >
                                {renderHeaderLabel()}
                            </th>
                        )}
                        {headerRow.map((header, colIndex) => {
                            if (header.hidden) return null;
                            
                            return (
                                <th 
                                    key={colIndex}
                                    colSpan={header.colspan}
                                    className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-center font-semibold text-gray-900 dark:text-white whitespace-nowrap ${
                                        header.isGroup 
                                            ? 'bg-purple-100 dark:bg-purple-900' 
                                            : 'bg-blue-100 dark:bg-blue-900'
                                    }`}
                                >
                                    {header.label}
                                </th>
                            );
                        })}
                        {rowIndex === 0 && shouldShowTotalColumn() && (
                            <th 
                                rowSpan={pivotResult.colHeadersHierarchy.length}
                                className="border border-gray-300 dark:border-gray-600 bg-green-100 dark:bg-green-900 px-4 py-3 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap"
                            >
                                TOTAL
                            </th>
                        )}
                    </tr>
                ))}
            </>
        );
    };

    const renderFirstColumnHeader = () => {
        if (pivotResult.mode === 'hierarchical' || pivotResult.mode === 'hierarchical-both') {
            return (
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {rows.map(r => r.label).join(' / ')}
                </th>
            );
        }
        if (pivotResult.mode === 'hierarchical-cols') {
            return (
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {rows[0]?.label || 'Valor'}
                </th>
            );
        }
        if (pivotResult.mode === 'full-pivot') {
            return (
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {rows[0]?.label} / {cols[0]?.label}
                </th>
            );
        }
        if (pivotResult.mode === 'single-dimension') {
            return (
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {rows[0]?.label}
                </th>
            );
        }
        return null;
    };

    const renderHeaderLabel = () => {
        if (rows.length > 1) {
            return rows.map(r => r.label).join(' / ');
        }
        return rows[0]?.label || 'Valor';
    };

    const shouldShowTotalColumn = () => {
        return pivotResult.mode === 'full-pivot' || 
               pivotResult.mode === 'hierarchical' || 
               pivotResult.mode === 'hierarchical-cols' ||
               pivotResult.mode === 'hierarchical-both';
    };

    const getHierarchyBadge = () => {
        const rowLevels = rows.length;
        const colLevels = cols.length;
        
        if (rowLevels > 1 && colLevels > 1) {
            return `Jerarquía: ${rowLevels} niveles (filas) × ${colLevels} niveles (cols)`;
        }
        if (rowLevels > 1) {
            return `Jerarquía: ${rowLevels} niveles (filas)`;
        }
        if (colLevels > 1) {
            return `Jerarquía: ${colLevels} niveles (columnas)`;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors w-full">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">FarmaPlus</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Sistema de Fidelización</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 ml-6">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {pharmacyData.length} movimientos
                                </span>
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden w-full ${isPanelExpanded ? 'max-h-[500px]' : 'max-h-[60px]'}`}>
                <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" onClick={() => setIsPanelExpanded(!isPanelExpanded)}>
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div>
                            <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Configuración del Pivot</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{getConfigSummary()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {(rows.length > 0 || cols.length > 0 || vals.length > 0) && (
                            <button onClick={(e) => { e.stopPropagation(); clearAllFields(); }} className="text-xs text-red-600 dark:text-red-400 hover:underline transition-colors">
                                Limpiar
                            </button>
                        )}
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                            {isPanelExpanded ? <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Campos Disponibles</h3>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                                <FieldList fields={pharmacyFields} onDragStart={handleDragStart} />
                            </div>
                        </div>

                        <div className="col-span-9 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <DropZone label="Filas" icon="📊" fields={rows} onDrop={handleDropRows} onDragOver={handleDragOver} onRemove={removeFromRows} onReorder={reorderRows} color="blue" />
                                <DropZone label="Columnas" icon="📊" fields={cols} onDrop={handleDropCols} onDragOver={handleDragOver} onRemove={removeFromCols} onReorder={reorderCols} color="green" />
                                <DropZone label="Valores" icon="🔢" fields={vals} onDrop={handleDropVals} onDragOver={handleDragOver} onRemove={removeFromVals} onReorder={reorderVals} color="purple" allowNumericOnly={true} />
                                <DropZone label="Filtros" icon="🔍" fields={filters} onDrop={handleDropFilters} onDragOver={handleDragOver} onRemove={removeFromFilters} onReorder={reorderFilters} color="yellow" />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">🧮 Función de Agregación:</label>
                                <select value={aggregator} onChange={(e) => setAggregator(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent">
                                    {aggregators.map(agg => <option key={agg.key} value={agg.key}>{agg.label}</option>)}
                                </select>
                            </div>

                            {/* Toggle Subtotales */}
                            {(rows.length > 1 || cols.length > 1) && (
                                <div className="flex items-center gap-3 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={showSubtotals} 
                                            onChange={(e) => setShowSubtotals(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            📊 Mostrar subtotales
                                        </span>
                                    </label>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {showSubtotals ? '(Visible)' : '(Oculto)'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE FILTROS INTERACTIVOS */}
            {filters.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 w-full">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                                Filtros Activos
                                {getActiveFiltersCount() > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                                        {getActiveFiltersCount()}
                                    </span>
                                )}
                            </h3>
                        </div>
                        {getActiveFiltersCount() > 0 && (
                            <button 
                                onClick={resetFilters}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
                            >
                                <X className="w-3 h-3" />
                                Reset Filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {filters.map((filter, index) => {
                            const uniqueValues = getUniqueValues(pharmacyData, filter.key);
                            const currentValue = filterValues[filter.key] || 'all';
                            
                            return (
                                <div key={index} className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {filter.label}
                                    </label>
                                    <select
                                        value={currentValue}
                                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                        className={`px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all ${
                                            currentValue !== 'all' 
                                                ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900' 
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        <option value="all">Todos ({uniqueValues.length})</option>
                                        {uniqueValues.map((value, i) => (
                                            <option key={i} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                            Mostrando <strong className="text-blue-600 dark:text-blue-400">{getFilteredRecordsCount()}</strong> de <strong>{pharmacyData.length}</strong> registros
                            {getActiveFiltersCount() > 0 && (
                                <span className="ml-1">
                                    ({Math.round((getFilteredRecordsCount() / pharmacyData.length) * 100)}% del total)
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            )}

            <div className="w-full p-6">
                {pivotResult && !pivotResult.isEmpty ? (
                    <div className="space-y-4 w-full">
                        {stats && (
                            <div className="grid grid-cols-5 gap-3">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-4 text-white">
                                    <p className="text-xs opacity-90 mb-1">Total</p>
                                    <p className="text-2xl font-bold">{formatValue(pivotResult.grandTotal, aggregator, vals[0])}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mínimo</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(stats.min, aggregator, vals[0])}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Promedio</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(stats.avg, aggregator, vals[0])}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Máximo</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(stats.max, aggregator, vals[0])}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Celdas</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.count}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-full">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h2 className="font-semibold text-gray-800 dark:text-white">Resultado del Pivot</h2>
                                    {getHierarchyBadge() && (
                                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                            {getHierarchyBadge()}
                                        </span>
                                    )}
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded flex items-center gap-1">
                                            <Filter className="w-3 h-3" />
                                            {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {(pivotResult.mode === 'hierarchical' || pivotResult.mode === 'hierarchical-both') && rows.length > 1 && (
                                        <>
                                            <button 
                                                onClick={expandAll}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                                                title="Expandir todos los grupos"
                                            >
                                                <Maximize2 className="w-3 h-3" />
                                                Expandir Todo
                                            </button>
                                            <button 
                                                onClick={collapseAll}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                                                title="Colapsar todos los grupos"
                                            >
                                                <Minimize2 className="w-3 h-3" />
                                                Colapsar Todo
                                            </button>
                                        </>
                                    )}
                                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors">
                                        <Download className="w-4 h-4" />
                                        Exportar CSV
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm">
                                    <thead>
                                        {renderColHeaders()}
                                    </thead>
                                    <tbody>
                                        {(pivotResult.mode === 'hierarchical' || pivotResult.mode === 'hierarchical-both') ? (
                                            pivotResult.hierarchyData.map((row, rowIndex) => {
                                                if (!isRowVisible(row, rowIndex)) return null;
                                                
                                                const rowStyle = getRowStyle(row.level, row.isSubtotal);
                                                const icon = getLevelIcon(row.level, row.isSubtotal);
                                                const collapsed = isGroupCollapsed(row);
                                                const canToggle = hasChildren(row, rowIndex) && !row.isSubtotal;
                                                
                                                return (
                                                    <tr key={rowIndex} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${rowStyle.bg}`}>
                                                        <td className={`border border-gray-300 dark:border-gray-600 px-4 py-3 ${rowStyle.text} whitespace-nowrap`} style={{ paddingLeft: rowStyle.paddingLeft }}>
                                                            <div className="flex items-center gap-2">
                                                                {canToggle && (
                                                                    <button
                                                                        onClick={() => toggleGroup(row)}
                                                                        className="flex items-center justify-center w-5 h-5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                                                        title={collapsed ? 'Expandir' : 'Colapsar'}
                                                                    >
                                                                        {collapsed ? (
                                                                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                        ) : (
                                                                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                        )}
                                                                    </button>
                                                                )}
                                                                {!canToggle && <span className="w-5"></span>}
                                                                <span className="mr-1">{icon}</span>
                                                                <span>{row.value}</span>
                                                            </div>
                                                        </td>
                                                        
                                                        {row.data.map((value, colIndex) => (
                                                            <td key={colIndex} className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-right ${row.isSubtotal ? 'font-semibold' : ''} text-gray-900 dark:text-white whitespace-nowrap`}>
                                                                {formatValue(value, aggregator, vals[0])}
                                                            </td>
                                                        ))}
                                                        
                                                        <td className={`border border-gray-300 dark:border-gray-600 px-4 py-3 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap ${row.isSubtotal ? 'bg-green-100 dark:bg-green-900/40' : 'bg-green-50 dark:bg-green-900/30'}`}>
                                                            {formatValue(row.total, aggregator, vals[0])}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            pivotResult.rowHeaders && pivotResult.rowHeaders.map((rowHeader, rowIndex) => (
                                                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                        {rowHeader}
                                                    </td>
                                                    
                                                    {pivotResult.data[rowIndex].map((value, colIndex) => (
                                                        <td key={colIndex} className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-gray-900 dark:text-white whitespace-nowrap">
                                                            {formatValue(value, aggregator, vals[0])}
                                                        </td>
                                                    ))}
                                                    
                                                    {shouldShowTotalColumn() && (
                                                        <td className="border border-gray-300 dark:border-gray-600 bg-green-50 dark:bg-green-900/30 px-4 py-3 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                            {formatValue(pivotResult.rowTotals[rowIndex], aggregator, vals[0])}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        )}
                                        
                                        {shouldShowTotalColumn() && (
                                            <tr className="bg-green-100 dark:bg-green-900 font-bold">
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                                                    TOTAL GENERAL
                                                </td>
                                                {pivotResult.colTotals.map((total, i) => (
                                                    <td key={i} className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right text-gray-900 dark:text-white whitespace-nowrap">
                                                        {formatValue(total, aggregator, vals[0])}
                                                    </td>
                                                ))}
                                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-right bg-green-200 dark:bg-green-800 text-gray-900 dark:text-white whitespace-nowrap">
                                                    {formatValue(pivotResult.grandTotal, aggregator, vals[0])}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    ✨ Cálculos generados en tiempo real
                                    {(rows.length > 1 || cols.length > 1) && ' • Con jerarquías y subtotales'}
                                    {rows.length > 1 && ' • Click en [+]/[−] para expandir/colapsar grupos'}
                                    {getActiveFiltersCount() > 0 && ` • ${getActiveFiltersCount()} filtro${getActiveFiltersCount() > 1 ? 's' : ''} aplicado${getActiveFiltersCount() > 1 ? 's' : ''}`}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700 w-full">
                        <Table className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Configura tu tabla pivote
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Arrastra campos a las zonas de Filas, Columnas o Valores para comenzar
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                            💡 Tip: Arrastra múltiples campos a Filas y Columnas para crear jerarquías
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
