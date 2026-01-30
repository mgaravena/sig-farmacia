# 📊 PASO 9: TOGGLE MOSTRAR/OCULTAR SUBTOTALES

## ✅ Completado

Se ha implementado un checkbox que permite mostrar u ocultar los subtotales de la tabla pivote.

---

## 🎯 Funcionalidad Implementada

### **Checkbox de Subtotales:**
- ✅ Ubicado debajo del selector de Agregación
- ✅ Solo aparece cuando hay jerarquías (2+ niveles en filas o columnas)
- ✅ Estado por defecto: ACTIVADO (subtotales visibles)
- ✅ Texto descriptivo con estado actual

---

## 🎨 Diseño Visual

### **Panel de Configuración:**

```
┌─────────────────────────────────────────┐
│ ⚙️ CONFIGURACIÓN DEL PIVOT              │
├─────────────────────────────────────────┤
│ 🧮 Función de Agregación: [Suma ▼]     │
│                                         │
│ ☑ Mostrar subtotales (Visible)          │ ← NUEVO
└─────────────────────────────────────────┘
```

**Con jerarquía simple (1 nivel):**
- ❌ Checkbox NO aparece (no hay subtotales)

**Con jerarquía múltiple (2+ niveles):**
- ✅ Checkbox aparece automáticamente

---

## 📊 Comportamiento

### **SUBTOTALES ACTIVADOS (☑):**

```
┌──────────────────────────┬────────┬────────┬────────┐
│ Cliente / Categoría      │ Compra │ Canje  │ TOTAL  │
├──────────────────────────┼────────┼────────┼────────┤
│ 📦 María González        │        │        │        │
│   💎 Oro                 │  3,450 │    200 │  3,650 │
│   💎 Plata               │    100 │      0 │    100 │
│   ├─ Subtotal González   │  3,550 │    200 │  3,750 │ ← VISIBLE
├──────────────────────────┼────────┼────────┼────────┤
│ 📦 Juan Pérez            │        │        │        │
│   💎 Oro                 │  6,980 │      0 │  6,980 │
│   ├─ Subtotal Pérez      │  6,980 │      0 │  6,980 │ ← VISIBLE
├──────────────────────────┼────────┼────────┼────────┤
│ TOTAL GENERAL            │ 10,530 │    200 │ 10,730 │
└──────────────────────────┴────────┴────────┴────────┘
```

**Características:**
- ✅ Subtotales con prefijo "├─"
- ✅ Fondo destacado
- ✅ Texto semibold
- ✅ Total General siempre visible

---

### **SUBTOTALES DESACTIVADOS (☐):**

```
┌──────────────────────────┬────────┬────────┬────────┐
│ Cliente / Categoría      │ Compra │ Canje  │ TOTAL  │
├──────────────────────────┼────────┼────────┼────────┤
│ 📦 María González        │        │        │        │
│   💎 Oro                 │  3,450 │    200 │  3,650 │
│   💎 Plata               │    100 │      0 │    100 │
│                          │        │        │        │ ← SIN subtotal
├──────────────────────────┼────────┼────────┼────────┤
│ 📦 Juan Pérez            │        │        │        │
│   💎 Oro                 │  6,980 │      0 │  6,980 │
│                          │        │        │        │ ← SIN subtotal
├──────────────────────────┼────────┼────────┼────────┤
│ TOTAL GENERAL            │ 10,530 │    200 │ 10,730 │ ← Siempre visible
└──────────────────────────┴────────┴────────┴────────┘
```

**Características:**
- ❌ Filas "├─ Subtotal..." ocultas
- ✅ Estructura de jerarquía intacta
- ✅ Datos de detalle visibles
- ✅ Total General siempre visible

---

## 🔧 Detalles Técnicos

### **Estado agregado:**
```javascript
const [showSubtotals, setShowSubtotals] = useState(true);
```

**Valor por defecto:** `true` (subtotales visibles)

---

### **Modificación en `isRowVisible()`:**
```javascript
const isRowVisible = (row, rowIndex) => {
    if (!pivotResult.hierarchyData) return true;
    
    // Ocultar subtotales si showSubtotals es false
    if (row.isSubtotal && !showSubtotals) {
        return false;
    }
    
    // ... resto de la lógica (expand/collapse)
    
    return true;
};
```

**Lógica:**
1. Si la fila es subtotal (`row.isSubtotal === true`)
2. Y el toggle está desactivado (`showSubtotals === false`)
3. Retorna `false` (oculta la fila)
4. Si no, sigue con la lógica normal de expand/collapse

---

### **Checkbox en el JSX:**
```javascript
{/* Solo mostrar si hay jerarquías */}
{(rows.length > 1 || cols.length > 1) && (
    <div className="flex items-center gap-3 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
            <input 
                type="checkbox" 
                checked={showSubtotals} 
                onChange={(e) => setShowSubtotals(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm font-medium">
                📊 Mostrar subtotales
            </span>
        </label>
        <span className="text-xs text-gray-500">
            {showSubtotals ? '(Visible)' : '(Oculto)'}
        </span>
    </div>
)}
```

**Condición de visibilidad:**
- `rows.length > 1`: Hay jerarquía en filas
- O `cols.length > 1`: Hay jerarquía en columnas
- Si no hay jerarquías, el checkbox no aparece

---

## 💡 Casos de Uso

### **Caso 1: Vista Limpia**
**Objetivo:** Ver solo el detalle sin subtotales que ocupan espacio

**Config:**
```
Filas: Comercio → Categoría
Valores: Total Venta
```

**Acción:** Desactivar "Mostrar subtotales"

**Resultado:**
- Solo se ven las categorías de cada comercio
- Total General al final
- Vista más compacta

---

### **Caso 2: Análisis de Totales**
**Objetivo:** Ver rápidamente los totales por comercio

**Config:**
```
Filas: Comercio → Categoría → Cliente
Valores: Total Venta
```

**Acción:** Activar "Mostrar subtotales"

**Resultado:**
- Subtotales por Comercio
- Subtotales por Categoría
- Total General
- Vista completa de agregaciones

---

### **Caso 3: Exportar sin Subtotales**
**Objetivo:** CSV solo con detalle

**Config:**
- Configuración con jerarquías
- Desactivar "Mostrar subtotales"

**Acción:** Exportar CSV

**Resultado:**
- CSV sin filas de subtotales
- Solo detalle y total general
- Más limpio para análisis en Excel

---

## ✅ Verificación

### **Test 1: Sin Jerarquía**
1. Config: Filas: Cliente (1 nivel) | Valores: Puntos
2. **Verifica:** Checkbox NO aparece
3. **Razón:** No hay subtotales con 1 solo nivel

---

### **Test 2: Con Jerarquía - Activado**
1. Config: Filas: Comercio → Categoría (2 niveles) | Valores: Puntos
2. **Verifica:** Checkbox aparece y está ACTIVADO
3. **Verifica:** Se ven filas "├─ Subtotal Comercio"
4. **Verifica:** Total General al final

---

### **Test 3: Con Jerarquía - Desactivado**
1. Misma config anterior
2. Desactivar checkbox
3. **Verifica:** Filas "├─ Subtotal..." desaparecen
4. **Verifica:** Estructura se mantiene (Comercio > Categorías)
5. **Verifica:** Total General sigue visible
6. **Verifica:** Texto cambia a "(Oculto)"

---

### **Test 4: Con Expand/Collapse**
1. Config: Comercio → Categoría → Cliente (3 niveles)
2. Activar subtotales
3. Colapsar "Farmacia Centro"
4. **Verifica:** Subtotal de Centro sigue visible
5. Desactivar subtotales
6. **Verifica:** Subtotal de Centro se oculta
7. **Verifica:** Expand/collapse sigue funcionando

---

### **Test 5: Cambiar entre Jerarquías**
1. Config inicial: Comercio → Categoría (checkbox visible)
2. Desactivar subtotales
3. Quitar "Categoría" de Filas (solo Comercio)
4. **Verifica:** Checkbox desaparece (no hay jerarquía)
5. Agregar "Categoría" nuevamente
6. **Verifica:** Checkbox reaparece
7. **Verifica:** Estado se mantiene (desactivado)

---

### **Test 6: Dark Mode**
1. Activar dark mode
2. **Verifica:** Checkbox visible y legible
3. **Verifica:** Texto descriptivo contrastado
4. **Verifica:** Hover funciona correctamente

---

## 🎨 Estilos

### **Checkbox:**
```css
w-4 h-4                    /* Tamaño 16x16px */
text-blue-600             /* Color cuando activado */
bg-gray-100               /* Fondo light mode */
dark:bg-gray-700          /* Fondo dark mode */
border-gray-300           /* Borde light mode */
dark:border-gray-600      /* Borde dark mode */
rounded                   /* Bordes redondeados */
focus:ring-2              /* Anillo al hacer focus */
focus:ring-blue-500       /* Color del anillo */
cursor-pointer            /* Cursor pointer */
```

### **Label:**
```css
text-sm                   /* Tamaño de texto */
font-medium               /* Peso medio */
text-gray-700             /* Color light mode */
dark:text-gray-300        /* Color dark mode */
cursor-pointer            /* Cursor pointer (todo el label) */
```

### **Estado:**
```css
text-xs                   /* Texto pequeño */
text-gray-500             /* Color gris */
dark:text-gray-400        /* Color gris oscuro */
```

---

## 🔄 Compatibilidad

### **Compatible con:**
- ✅ Todas las jerarquías (2, 3, 4+ niveles)
- ✅ Expand/Collapse (independientes)
- ✅ Filtros interactivos
- ✅ Todas las agregaciones
- ✅ Dark mode
- ✅ Exportar CSV
- ✅ Columnas jerárquicas

### **No afecta a:**
- ✅ Total General (siempre visible)
- ✅ Datos de detalle (siempre visibles)
- ✅ Cálculos (se mantienen correctos)
- ✅ Headers de tabla
- ✅ Estructura de datos

---

## 📝 Notas Técnicas

### **¿Por qué solo afecta visualización?**

El filtrado se hace en **renderizado**, no en cálculo:
```javascript
// En el map de filas:
pivotResult.hierarchyData.map((row, rowIndex) => {
    if (!isRowVisible(row, rowIndex)) return null;  // ← Aquí
    // ... renderizar fila
})
```

**Ventajas:**
- ✅ Datos originales intactos
- ✅ Cálculos correctos
- ✅ Rápido (no recalcula)
- ✅ Reversible instantáneamente

---

### **¿Por qué Total General sigue visible?**

El Total General NO tiene `isSubtotal: true`:
```javascript
// En shouldShowTotalColumn():
if (shouldShowTotalColumn()) {
    // Renderiza fila TOTAL GENERAL
    // Esta NO pasa por isRowVisible()
}
```

Es una fila especial que se renderiza aparte.

---

## 🚦 Estado del Proyecto

### ✅ **Pasos Completados (1-9):**
1. ✅ Setup básico
2. ✅ Drag & drop
3. ✅ Cálculos + agregaciones
4. ✅ Jerarquías en filas
5. ✅ Jerarquías en columnas
6. ✅ Expand/Collapse
7. ✅ Filtros Interactivos
8. ⏸️ Múltiples Valores (pospuesto)
9. ✅ Toggle Subtotales ← **COMPLETADO**

### ⏳ **Pasos Pendientes (10-11):**
10. ⏳ Heatmap (4 variantes)
11. ⏳ Filtros con Checkboxes

---

## 🎯 Próximo Paso

**PASO 10: HEATMAP (4 VARIANTES)**

Implementaremos:
- Selector de modo de visualización
- Table (normal)
- Heatmap (global)
- Row Heatmap (por fila)
- Col Heatmap (por columna)
- Escala de colores automática
- Números visibles sobre colores

---

**Estado**: ✅ PASO 9 COMPLETADO  
**Tiempo**: ~30 minutos  
**Archivos**: PivotTable.jsx  
**Próximo**: PASO 10 - Heatmap
