// ==================== APLICAR FILTROS ====================

export function applyFilters(data, filters, filterValues) {
    if (!filters || filters.length === 0) return data;
    
    return data.filter(row => {
        return filters.every(filter => {
            const filterValue = filterValues[filter.key];
            if (!filterValue || filterValue === 'all') return true;
            
            // Si es array (múltiples valores seleccionados), usar OR
            if (Array.isArray(filterValue)) {
                return filterValue.includes(row[filter.key]);
            }
            
            return row[filter.key] === filterValue;
        });
    });
}

// ==================== OBTENER VALORES ÚNICOS ====================

export function getUniqueValues(data, fieldKey) {
    const values = [...new Set(data.map(row => row[fieldKey]))];
    return values.sort((a, b) => {
        if (typeof a === 'string') return a.localeCompare(b);
        return a - b;
    });
}

// ==================== AGREGACIONES ====================

const aggregators = {
    sum: (values) => values.reduce((sum, val) => sum + (val || 0), 0),
    count: (values) => values.length,
    avg: (values) => {
        const sum = values.reduce((s, val) => s + (val || 0), 0);
        return values.length > 0 ? sum / values.length : 0;
    },
    min: (values) => values.length > 0 ? Math.min(...values.map(v => v || 0)) : 0,
    max: (values) => values.length > 0 ? Math.max(...values.map(v => v || 0)) : 0,
};

function aggregate(values, aggregator) {
    if (!aggregators[aggregator]) return 0;
    return aggregators[aggregator](values);
}

// ==================== PROCESAR DATOS DEL PIVOT ====================

export function processPivotData(data, rows, cols, vals, aggregator, filters, filterValues) {
    // Validaciones básicas
    if (!data || data.length === 0) {
        return { isEmpty: true };
    }

    // Aplicar filtros
    const filteredData = applyFilters(data, filters, filterValues);
    
    if (filteredData.length === 0) {
        return { isEmpty: true };
    }

    // Si no hay configuración, retornar vacío
    if (rows.length === 0 && cols.length === 0 && vals.length === 0) {
        return { isEmpty: true };
    }

    // Determinar modo de operación
    const hasRows = rows.length > 0;
    const hasCols = cols.length > 0;
    const hasVals = vals.length > 0;

    if (!hasVals) {
        return { isEmpty: true };
    }

    const valueField = vals[0].key;

    // CASO 1: Solo filas (sin columnas)
    if (hasRows && !hasCols) {
        if (rows.length === 1) {
            return processSingleDimension(filteredData, rows[0], valueField, aggregator);
        } else {
            return processHierarchicalRows(filteredData, rows, valueField, aggregator);
        }
    }

    // CASO 2: Filas + Columnas
    if (hasRows && hasCols) {
        if (rows.length === 1 && cols.length === 1) {
            return processFullPivot(filteredData, rows[0], cols[0], valueField, aggregator);
        } else if (rows.length > 1 && cols.length === 1) {
            return processHierarchicalRowsWithCols(filteredData, rows, cols[0], valueField, aggregator);
        } else if (rows.length === 1 && cols.length > 1) {
            return processHierarchicalCols(filteredData, rows[0], cols, valueField, aggregator);
        } else {
            return processHierarchicalBoth(filteredData, rows, cols, valueField, aggregator);
        }
    }

    return { isEmpty: true };
}

// ==================== PROCESAR MÚLTIPLES VALORES ====================

function processMultipleValues(data, rows, cols, vals, aggregator) {
    const hasRows = rows.length > 0;
    const hasCols = cols.length > 0;

    // Caso simple: Solo filas + múltiples valores
    if (hasRows && !hasCols) {
        if (rows.length === 1) {
            return processMultipleValuesSimple(data, rows[0], vals, aggregator);
        } else {
            return processMultipleValuesHierarchical(data, rows, vals, aggregator);
        }
    }

    // Caso complejo: Filas + Columnas + múltiples valores
    if (hasRows && hasCols) {
        if (rows.length === 1 && cols.length === 1) {
            return processMultipleValuesWithCols(data, rows[0], cols[0], vals, aggregator);
        } else if (rows.length > 1 && cols.length === 1) {
            return processMultipleValuesHierarchicalWithCols(data, rows, cols[0], vals, aggregator);
        } else if (rows.length === 1 && cols.length > 1) {
            return processMultipleValuesWithHierarchicalCols(data, rows[0], cols, vals, aggregator);
        } else {
            return processMultipleValuesBoth(data, rows, cols, vals, aggregator);
        }
    }

    return { isEmpty: true };
}

// ==================== MÚLTIPLES VALORES: SOLO FILAS (1 nivel) ====================

function processMultipleValuesSimple(data, rowField, vals, aggregator) {
    const rowValues = getUniqueValues(data, rowField.key);
    
    // Headers de columna = nombres de los valores
    const colHeaders = vals.map(v => v.label);
    
    // Matriz de datos
    const matrix = [];
    const rowTotals = [];
    
    rowValues.forEach(rowValue => {
        const rowData = data.filter(d => d[rowField.key] === rowValue);
        const row = [];
        let rowTotal = 0;
        
        vals.forEach(val => {
            const values = rowData.map(d => d[val.key]);
            const aggValue = aggregate(values, aggregator);
            row.push(aggValue);
            rowTotal += aggValue;
        });
        
        matrix.push(row);
        rowTotals.push(rowTotal);
    });
    
    // Totales por columna
    const colTotals = vals.map((val, idx) => {
        return matrix.reduce((sum, row) => sum + (row[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'multiple-values-simple',
        isEmpty: false,
        rowHeaders: rowValues,
        colHeaders,
        data: matrix,
        rowTotals,
        colTotals,
        grandTotal,
        valueFields: vals
    };
}

// ==================== MÚLTIPLES VALORES: FILAS JERÁRQUICAS ====================

function processMultipleValuesHierarchical(data, rows, vals, aggregator) {
    const hierarchyData = buildHierarchyWithMultipleValues(data, rows, vals, aggregator);
    
    const colHeaders = vals.map(v => v.label);
    
    // Calcular totales por columna (valores)
    const colTotals = vals.map((val, idx) => {
        return hierarchyData
            .filter(row => row.level === 0 && !row.isSubtotal)
            .reduce((sum, row) => sum + (row.data[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'multiple-values-hierarchical',
        isEmpty: false,
        hierarchyData,
        colHeaders,
        colTotals,
        grandTotal,
        valueFields: vals
    };
}

function buildHierarchyWithMultipleValues(data, rows, vals, aggregator, parentPath = []) {
    const result = [];
    const level = parentPath.length;
    
    if (level >= rows.length) return result;
    
    const currentField = rows[level];
    const uniqueValues = getUniqueValues(data, currentField.key);
    
    uniqueValues.forEach(value => {
        const filteredData = data.filter(d => d[currentField.key] === value);
        const currentPath = [...parentPath, value];
        
        // Calcular valores para este grupo
        const rowData = vals.map(val => {
            const values = filteredData.map(d => d[val.key]);
            return aggregate(values, aggregator);
        });
        
        const rowTotal = rowData.reduce((sum, val) => sum + val, 0);
        
        // Agregar fila del grupo
        result.push({
            level,
            value,
            path: currentPath,
            data: rowData,
            total: rowTotal,
            isSubtotal: false
        });
        
        // Procesar hijos recursivamente
        if (level < rows.length - 1) {
            const children = buildHierarchyWithMultipleValues(filteredData, rows, vals, aggregator, currentPath);
            result.push(...children);
            
            // Agregar subtotal si hay hijos
            if (children.length > 0) {
                result.push({
                    level,
                    value: `Subtotal ${value}`,
                    path: currentPath,
                    data: rowData,
                    total: rowTotal,
                    isSubtotal: true
                });
            }
        }
    });
    
    return result;
}

// ==================== MÚLTIPLES VALORES: CON COLUMNAS (1 nivel cada uno) ====================

function processMultipleValuesWithCols(data, rowField, colField, vals, aggregator) {
    const rowValues = getUniqueValues(data, rowField.key);
    const colValues = getUniqueValues(data, colField.key);
    
    // Headers: colValues × vals
    const colHeaders = [];
    colValues.forEach(colVal => {
        vals.forEach(val => {
            colHeaders.push(`${colVal} - ${val.label}`);
        });
    });
    
    // Matriz de datos
    const matrix = [];
    const rowTotals = [];
    
    rowValues.forEach(rowValue => {
        const row = [];
        let rowTotal = 0;
        
        colValues.forEach(colValue => {
            const cellData = data.filter(d => 
                d[rowField.key] === rowValue && 
                d[colField.key] === colValue
            );
            
            vals.forEach(val => {
                const values = cellData.map(d => d[val.key]);
                const aggValue = aggregate(values, aggregator);
                row.push(aggValue);
                rowTotal += aggValue;
            });
        });
        
        matrix.push(row);
        rowTotals.push(rowTotal);
    });
    
    // Totales por columna
    const colTotals = colHeaders.map((_, idx) => {
        return matrix.reduce((sum, row) => sum + (row[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'multiple-values-with-cols',
        isEmpty: false,
        rowHeaders: rowValues,
        colHeaders,
        data: matrix,
        rowTotals,
        colTotals,
        grandTotal,
        valueFields: vals,
        colValues
    };
}

// ==================== MÚLTIPLES VALORES: FILAS JERÁRQUICAS + COLUMNAS ====================

function processMultipleValuesHierarchicalWithCols(data, rows, colField, vals, aggregator) {
    const colValues = getUniqueValues(data, colField.key);
    
    // Headers: colValues × vals
    const colHeaders = [];
    colValues.forEach(colVal => {
        vals.forEach(val => {
            colHeaders.push(`${colVal} - ${val.label}`);
        });
    });
    
    const hierarchyData = buildHierarchyWithMultipleValuesAndCols(data, rows, colField, colValues, vals, aggregator);
    
    // Totales por columna
    const colTotals = colHeaders.map((_, idx) => {
        return hierarchyData
            .filter(row => row.level === 0 && !row.isSubtotal)
            .reduce((sum, row) => sum + (row.data[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'multiple-values-hierarchical-cols',
        isEmpty: false,
        hierarchyData,
        colHeaders,
        colTotals,
        grandTotal,
        valueFields: vals,
        colValues
    };
}

function buildHierarchyWithMultipleValuesAndCols(data, rows, colField, colValues, vals, aggregator, parentPath = []) {
    const result = [];
    const level = parentPath.length;
    
    if (level >= rows.length) return result;
    
    const currentField = rows[level];
    const uniqueValues = getUniqueValues(data, currentField.key);
    
    uniqueValues.forEach(value => {
        const filteredData = data.filter(d => d[currentField.key] === value);
        const currentPath = [...parentPath, value];
        
        // Calcular valores para cada columna × valor
        const rowData = [];
        let rowTotal = 0;
        
        colValues.forEach(colValue => {
            const cellData = filteredData.filter(d => d[colField.key] === colValue);
            
            vals.forEach(val => {
                const values = cellData.map(d => d[val.key]);
                const aggValue = aggregate(values, aggregator);
                rowData.push(aggValue);
                rowTotal += aggValue;
            });
        });
        
        // Agregar fila del grupo
        result.push({
            level,
            value,
            path: currentPath,
            data: rowData,
            total: rowTotal,
            isSubtotal: false
        });
        
        // Procesar hijos recursivamente
        if (level < rows.length - 1) {
            const children = buildHierarchyWithMultipleValuesAndCols(filteredData, rows, colField, colValues, vals, aggregator, currentPath);
            result.push(...children);
            
            if (children.length > 0) {
                result.push({
                    level,
                    value: `Subtotal ${value}`,
                    path: currentPath,
                    data: rowData,
                    total: rowTotal,
                    isSubtotal: true
                });
            }
        }
    });
    
    return result;
}

// ==================== MÚLTIPLES VALORES: CON COLUMNAS JERÁRQUICAS ====================

function processMultipleValuesWithHierarchicalCols(data, rowField, cols, vals, aggregator) {
    const rowValues = getUniqueValues(data, rowField.key);
    
    // Construir jerarquía de columnas
    const colHierarchy = buildColumnHierarchy(data, cols);
    const flatCols = flattenColumnHierarchy(colHierarchy, cols.length);
    
    // Para cada columna plana, calcular para cada valor
    const expandedCols = [];
    flatCols.forEach(col => {
        vals.forEach(val => {
            expandedCols.push({ ...col, valueField: val });
        });
    });
    
    // Headers jerárquicos con valores
    const colHeadersHierarchy = buildColHeadersWithValues(colHierarchy, cols, vals);
    
    // Matriz de datos
    const matrix = [];
    const rowTotals = [];
    
    rowValues.forEach(rowValue => {
        const row = [];
        let rowTotal = 0;
        
        expandedCols.forEach(col => {
            let cellData = data.filter(d => d[rowField.key] === rowValue);
            
            col.path.forEach((pathValue, idx) => {
                cellData = cellData.filter(d => d[cols[idx].key] === pathValue);
            });
            
            const values = cellData.map(d => d[col.valueField.key]);
            const aggValue = aggregate(values, aggregator);
            row.push(aggValue);
            rowTotal += aggValue;
        });
        
        matrix.push(row);
        rowTotals.push(rowTotal);
    });
    
    // Totales por columna
    const colTotals = expandedCols.map((_, idx) => {
        return matrix.reduce((sum, row) => sum + (row[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'multiple-values-hierarchical-cols',
        isEmpty: false,
        rowHeaders: rowValues,
        colHeaders: expandedCols.map(c => c.path.join(' - ') + ' - ' + c.valueField.label),
        colHeadersHierarchy,
        data: matrix,
        rowTotals,
        colTotals,
        grandTotal,
        valueFields: vals
    };
}

function buildColHeadersWithValues(colHierarchy, cols, vals) {
    // Última fila: valores
    const lastLevel = [];
    const flatCols = flattenColumnHierarchy(colHierarchy, cols.length);
    
    flatCols.forEach(col => {
        vals.forEach(val => {
            lastLevel.push({
                label: val.label,
                colspan: 1,
                hidden: false,
                isGroup: false
            });
        });
    });
    
    // Niveles superiores: grupos de columnas
    const upperLevels = buildColumnHeadersHierarchy(colHierarchy, cols);
    
    // Ajustar colspan para incluir valores
    upperLevels.forEach(level => {
        level.forEach(header => {
            if (!header.hidden) {
                header.colspan *= vals.length;
            }
        });
    });
    
    return [...upperLevels, lastLevel];
}

// ==================== MÚLTIPLES VALORES: AMBAS JERARQUÍAS ====================

function processMultipleValuesBoth(data, rows, cols, vals, aggregator) {
    // Construir jerarquía de columnas
    const colHierarchy = buildColumnHierarchy(data, cols);
    const flatCols = flattenColumnHierarchy(colHierarchy, cols.length);
    
    // Expandir columnas con valores
    const expandedCols = [];
    flatCols.forEach(col => {
        vals.forEach(val => {
            expandedCols.push({ ...col, valueField: val });
        });
    });
    
    // Headers jerárquicos con valores
    const colHeadersHierarchy = buildColHeadersWithValues(colHierarchy, cols, vals);
    
    // Construir jerarquía de filas con datos para cada columna expandida
    const hierarchyData = buildHierarchyBothWithValues(data, rows, expandedCols, cols, aggregator);
    
    // Totales por columna
    const colTotals = expandedCols.map((_, idx) => {
        return hierarchyData
            .filter(row => row.level === 0 && !row.isSubtotal)
            .reduce((sum, row) => sum + (row.data[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'multiple-values-both',
        isEmpty: false,
        hierarchyData,
        colHeadersHierarchy,
        colTotals,
        grandTotal,
        valueFields: vals
    };
}

function buildHierarchyBothWithValues(data, rows, expandedCols, cols, aggregator, parentPath = []) {
    const result = [];
    const level = parentPath.length;
    
    if (level >= rows.length) return result;
    
    const currentField = rows[level];
    const uniqueValues = getUniqueValues(data, currentField.key);
    
    uniqueValues.forEach(value => {
        const filteredData = data.filter(d => d[currentField.key] === value);
        const currentPath = [...parentPath, value];
        
        // Calcular valores para cada columna expandida
        const rowData = expandedCols.map(col => {
            let cellData = filteredData;
            
            col.path.forEach((pathValue, idx) => {
                cellData = cellData.filter(d => d[cols[idx].key] === pathValue);
            });
            
            const values = cellData.map(d => d[col.valueField.key]);
            return aggregate(values, aggregator);
        });
        
        const rowTotal = rowData.reduce((sum, val) => sum + val, 0);
        
        result.push({
            level,
            value,
            path: currentPath,
            data: rowData,
            total: rowTotal,
            isSubtotal: false
        });
        
        if (level < rows.length - 1) {
            const children = buildHierarchyBothWithValues(filteredData, rows, expandedCols, cols, aggregator, currentPath);
            result.push(...children);
            
            if (children.length > 0) {
                result.push({
                    level,
                    value: `Subtotal ${value}`,
                    path: currentPath,
                    data: rowData,
                    total: rowTotal,
                    isSubtotal: true
                });
            }
        }
    });
    
    return result;
}

// ==================== CASOS CON 1 SOLO VALOR (CÓDIGO EXISTENTE) ====================

function processSingleDimension(data, rowField, valueField, aggregator) {
    const rowValues = getUniqueValues(data, rowField.key);
    
    const colHeaders = [valueField];
    const matrix = [];
    const rowTotals = [];
    
    rowValues.forEach(rowValue => {
        const rowData = data.filter(d => d[rowField.key] === rowValue);
        const values = rowData.map(d => d[valueField]);
        const aggValue = aggregate(values, aggregator);
        
        matrix.push([aggValue]);
        rowTotals.push(aggValue);
    });
    
    const grandTotal = rowTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'single-dimension',
        isEmpty: false,
        rowHeaders: rowValues,
        colHeaders,
        data: matrix,
        rowTotals,
        colTotals: [grandTotal],
        grandTotal
    };
}

function processHierarchicalRows(data, rows, valueField, aggregator) {
    const hierarchyData = buildHierarchy(data, rows, valueField, aggregator);
    
    const grandTotal = hierarchyData
        .filter(row => row.level === 0 && !row.isSubtotal)
        .reduce((sum, row) => sum + row.total, 0);
    
    return {
        mode: 'hierarchical',
        isEmpty: false,
        hierarchyData,
        colHeaders: [valueField],
        colTotals: [grandTotal],
        grandTotal
    };
}

function buildHierarchy(data, rows, valueField, aggregator, parentPath = []) {
    const result = [];
    const level = parentPath.length;
    
    if (level >= rows.length) return result;
    
    const currentField = rows[level];
    const uniqueValues = getUniqueValues(data, currentField.key);
    
    uniqueValues.forEach(value => {
        const filteredData = data.filter(d => d[currentField.key] === value);
        const currentPath = [...parentPath, value];
        
        const values = filteredData.map(d => d[valueField]);
        const total = aggregate(values, aggregator);
        
        result.push({
            level,
            value,
            path: currentPath,
            data: [total],
            total,
            isSubtotal: false
        });
        
        if (level < rows.length - 1) {
            const children = buildHierarchy(filteredData, rows, valueField, aggregator, currentPath);
            result.push(...children);
            
            if (children.length > 0) {
                result.push({
                    level,
                    value: `Subtotal ${value}`,
                    path: currentPath,
                    data: [total],
                    total,
                    isSubtotal: true
                });
            }
        }
    });
    
    return result;
}

function processFullPivot(data, rowField, colField, valueField, aggregator) {
    const rowValues = getUniqueValues(data, rowField.key);
    const colValues = getUniqueValues(data, colField.key);
    
    const matrix = [];
    const rowTotals = [];
    
    rowValues.forEach(rowValue => {
        const row = [];
        let rowTotal = 0;
        
        colValues.forEach(colValue => {
            const cellData = data.filter(d => 
                d[rowField.key] === rowValue && 
                d[colField.key] === colValue
            );
            const values = cellData.map(d => d[valueField]);
            const aggValue = aggregate(values, aggregator);
            
            row.push(aggValue);
            rowTotal += aggValue;
        });
        
        matrix.push(row);
        rowTotals.push(rowTotal);
    });
    
    const colTotals = colValues.map((_, colIdx) => {
        return matrix.reduce((sum, row) => sum + (row[colIdx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'full-pivot',
        isEmpty: false,
        rowHeaders: rowValues,
        colHeaders: colValues,
        data: matrix,
        rowTotals,
        colTotals,
        grandTotal
    };
}

function processHierarchicalRowsWithCols(data, rows, colField, valueField, aggregator) {
    const colValues = getUniqueValues(data, colField.key);
    const hierarchyData = buildHierarchyWithCols(data, rows, colField, colValues, valueField, aggregator);
    
    const colTotals = colValues.map((_, colIdx) => {
        return hierarchyData
            .filter(row => row.level === 0 && !row.isSubtotal)
            .reduce((sum, row) => sum + (row.data[colIdx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'hierarchical',
        isEmpty: false,
        hierarchyData,
        colHeaders: colValues,
        colTotals,
        grandTotal
    };
}

function buildHierarchyWithCols(data, rows, colField, colValues, valueField, aggregator, parentPath = []) {
    const result = [];
    const level = parentPath.length;
    
    if (level >= rows.length) return result;
    
    const currentField = rows[level];
    const uniqueValues = getUniqueValues(data, currentField.key);
    
    uniqueValues.forEach(value => {
        const filteredData = data.filter(d => d[currentField.key] === value);
        const currentPath = [...parentPath, value];
        
        const rowData = colValues.map(colValue => {
            const cellData = filteredData.filter(d => d[colField.key] === colValue);
            const values = cellData.map(d => d[valueField]);
            return aggregate(values, aggregator);
        });
        
        const rowTotal = rowData.reduce((sum, val) => sum + val, 0);
        
        result.push({
            level,
            value,
            path: currentPath,
            data: rowData,
            total: rowTotal,
            isSubtotal: false
        });
        
        if (level < rows.length - 1) {
            const children = buildHierarchyWithCols(filteredData, rows, colField, colValues, valueField, aggregator, currentPath);
            result.push(...children);
            
            if (children.length > 0) {
                result.push({
                    level,
                    value: `Subtotal ${value}`,
                    path: currentPath,
                    data: rowData,
                    total: rowTotal,
                    isSubtotal: true
                });
            }
        }
    });
    
    return result;
}

function processHierarchicalCols(data, rowField, cols, valueField, aggregator) {
    const rowValues = getUniqueValues(data, rowField.key);
    const colHierarchy = buildColumnHierarchy(data, cols);
    const flatCols = flattenColumnHierarchy(colHierarchy, cols.length);
    
    const colHeadersHierarchy = buildColumnHeadersHierarchy(colHierarchy, cols);
    
    const matrix = [];
    const rowTotals = [];
    
    rowValues.forEach(rowValue => {
        const row = [];
        let rowTotal = 0;
        
        flatCols.forEach(col => {
            let cellData = data.filter(d => d[rowField.key] === rowValue);
            
            col.path.forEach((pathValue, idx) => {
                cellData = cellData.filter(d => d[cols[idx].key] === pathValue);
            });
            
            const values = cellData.map(d => d[valueField]);
            const aggValue = aggregate(values, aggregator);
            
            row.push(aggValue);
            rowTotal += aggValue;
        });
        
        matrix.push(row);
        rowTotals.push(rowTotal);
    });
    
    const colTotals = flatCols.map((_, idx) => {
        return matrix.reduce((sum, row) => sum + (row[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'hierarchical-cols',
        isEmpty: false,
        rowHeaders: rowValues,
        colHeaders: flatCols.map(c => c.path.join(' - ')),
        colHeadersHierarchy,
        data: matrix,
        rowTotals,
        colTotals,
        grandTotal
    };
}

function processHierarchicalBoth(data, rows, cols, valueField, aggregator) {
    const colHierarchy = buildColumnHierarchy(data, cols);
    const flatCols = flattenColumnHierarchy(colHierarchy, cols.length);
    const colHeadersHierarchy = buildColumnHeadersHierarchy(colHierarchy, cols);
    
    const hierarchyData = buildHierarchyBoth(data, rows, flatCols, cols, valueField, aggregator);
    
    const colTotals = flatCols.map((_, idx) => {
        return hierarchyData
            .filter(row => row.level === 0 && !row.isSubtotal)
            .reduce((sum, row) => sum + (row.data[idx] || 0), 0);
    });
    
    const grandTotal = colTotals.reduce((sum, val) => sum + val, 0);
    
    return {
        mode: 'hierarchical-both',
        isEmpty: false,
        hierarchyData,
        colHeadersHierarchy,
        colTotals,
        grandTotal
    };
}

function buildHierarchyBoth(data, rows, flatCols, cols, valueField, aggregator, parentPath = []) {
    const result = [];
    const level = parentPath.length;
    
    if (level >= rows.length) return result;
    
    const currentField = rows[level];
    const uniqueValues = getUniqueValues(data, currentField.key);
    
    uniqueValues.forEach(value => {
        const filteredData = data.filter(d => d[currentField.key] === value);
        const currentPath = [...parentPath, value];
        
        const rowData = flatCols.map(col => {
            let cellData = filteredData;
            
            col.path.forEach((pathValue, idx) => {
                cellData = cellData.filter(d => d[cols[idx].key] === pathValue);
            });
            
            const values = cellData.map(d => d[valueField]);
            return aggregate(values, aggregator);
        });
        
        const rowTotal = rowData.reduce((sum, val) => sum + val, 0);
        
        result.push({
            level,
            value,
            path: currentPath,
            data: rowData,
            total: rowTotal,
            isSubtotal: false
        });
        
        if (level < rows.length - 1) {
            const children = buildHierarchyBoth(filteredData, rows, flatCols, cols, valueField, aggregator, currentPath);
            result.push(...children);
            
            if (children.length > 0) {
                result.push({
                    level,
                    value: `Subtotal ${value}`,
                    path: currentPath,
                    data: rowData,
                    total: rowTotal,
                    isSubtotal: true
                });
            }
        }
    });
    
    return result;
}

function buildColumnHierarchy(data, cols, parentPath = [], level = 0) {
    if (level >= cols.length) return null;
    
    const currentField = cols[level];
    let filteredData = data;
    
    parentPath.forEach((pathValue, idx) => {
        filteredData = filteredData.filter(d => d[cols[idx].key] === pathValue);
    });
    
    const uniqueValues = getUniqueValues(filteredData, currentField.key);
    
    return uniqueValues.map(value => ({
        value,
        path: [...parentPath, value],
        level,
        children: level < cols.length - 1 
            ? buildColumnHierarchy(data, cols, [...parentPath, value], level + 1)
            : null
    }));
}

function flattenColumnHierarchy(hierarchy, maxLevel, result = []) {
    if (!hierarchy) return result;
    
    hierarchy.forEach(node => {
        if (node.level === maxLevel - 1) {
            result.push({ path: node.path });
        } else if (node.children) {
            flattenColumnHierarchy(node.children, maxLevel, result);
        }
    });
    
    return result;
}

function buildColumnHeadersHierarchy(colHierarchy, cols) {
    const levels = [];
    
    for (let level = 0; level < cols.length; level++) {
        levels.push([]);
    }
    
    function traverse(nodes, level) {
        if (!nodes) return;
        
        nodes.forEach(node => {
            const childCount = countLeaves(node);
            
            levels[level].push({
                label: node.value,
                colspan: childCount,
                hidden: false,
                isGroup: level < cols.length - 1
            });
            
            if (node.children) {
                traverse(node.children, level + 1);
            }
        });
    }
    
    traverse(colHierarchy, 0);
    return levels;
}

function countLeaves(node) {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

// ==================== UTILIDADES ====================

export function formatValue(value, aggregator, field) {
    if (value === null || value === undefined) return '-';
    
    if (aggregator === 'count') {
        return value.toLocaleString();
    }
    
    if (field && field.format === 'currency') {
        return '$' + value.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    
    if (aggregator === 'avg') {
        return value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    return value.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function calculateStats(pivotResult) {
    if (!pivotResult || pivotResult.isEmpty) return null;
    
    const values = [];
    
    if (pivotResult.hierarchyData) {
        pivotResult.hierarchyData.forEach(row => {
            if (!row.isSubtotal) {
                row.data.forEach(val => {
                    if (val !== null && val !== undefined) values.push(val);
                });
            }
        });
    } else {
        pivotResult.data.forEach(row => {
            row.forEach(val => {
                if (val !== null && val !== undefined) values.push(val);
            });
        });
    }
    
    if (values.length === 0) return null;
    
    return {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, val) => sum + val, 0) / values.length
    };
}

export function exportToCSV(pivotResult) {
    if (!pivotResult || pivotResult.isEmpty) return '';
    
    const lines = [];
    
    if (pivotResult.hierarchyData) {
        const header = ['', ...pivotResult.colHeaders, 'TOTAL'];
        lines.push(header.join(','));
        
        pivotResult.hierarchyData.forEach(row => {
            const indent = '  '.repeat(row.level);
            const rowData = [
                `"${indent}${row.value}"`,
                ...row.data.map(v => v || 0),
                row.total
            ];
            lines.push(rowData.join(','));
        });
    } else {
        const header = ['', ...pivotResult.colHeaders, 'TOTAL'];
        lines.push(header.join(','));
        
        pivotResult.rowHeaders.forEach((rowHeader, idx) => {
            const rowData = [
                `"${rowHeader}"`,
                ...pivotResult.data[idx].map(v => v || 0),
                pivotResult.rowTotals[idx]
            ];
            lines.push(rowData.join(','));
        });
    }
    
    const footer = ['TOTAL GENERAL', ...pivotResult.colTotals, pivotResult.grandTotal];
    lines.push(footer.join(','));
    
    return lines.join('\n');
}
