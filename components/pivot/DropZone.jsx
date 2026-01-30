'use client';

import { X, GripVertical } from 'lucide-react';

export default function DropZone({ 
    label, 
    icon,
    fields, 
    onDrop, 
    onDragOver, 
    onRemove,
    onReorder,
    color = 'blue',
    allowNumericOnly = false 
}) {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-300 dark:border-blue-700',
            tag: 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600',
            text: 'text-blue-600 dark:text-blue-400'
        },
        green: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-300 dark:border-green-700',
            tag: 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600',
            text: 'text-green-600 dark:text-green-400'
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-300 dark:border-purple-700',
            tag: 'bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600',
            text: 'text-purple-600 dark:text-purple-400'
        },
        yellow: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-300 dark:border-yellow-700',
            tag: 'bg-yellow-600 dark:bg-yellow-700 hover:bg-yellow-700 dark:hover:bg-yellow-600',
            text: 'text-yellow-600 dark:text-yellow-400'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    const handleDragStart = (e, field, index) => {
        e.dataTransfer.setData('field', JSON.stringify(field));
        e.dataTransfer.setData('sourceZone', label);
        e.dataTransfer.setData('sourceIndex', index);
    };

    const handleDragOverItem = (e, targetIndex) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDropOnItem = (e, targetIndex) => {
        e.preventDefault();
        e.stopPropagation();
        
        const sourceZone = e.dataTransfer.getData('sourceZone');
        const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
        
        if (sourceZone === label && sourceIndex !== targetIndex) {
            onReorder && onReorder(sourceIndex, targetIndex);
        }
    };

    return (
        <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block flex items-center gap-2">
                <span className={colors.text}>{icon}</span>
                {label}
                {allowNumericOnly && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">(solo numéricos)</span>
                )}
            </label>
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className={`min-h-[80px] ${colors.bg} border-2 border-dashed ${colors.border} rounded-lg p-3 transition-all`}
            >
                {fields.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
                        Arrastra campos aquí
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {fields.map((field, index) => (
                            <div
                                key={`${field.key}-${index}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, field, index)}
                                onDragOver={(e) => handleDragOverItem(e, index)}
                                onDrop={(e) => handleDropOnItem(e, index)}
                                className={`flex items-center gap-2 ${colors.tag} text-white px-3 py-2 rounded-full text-sm font-medium cursor-move transition-colors group`}
                            >
                                <GripVertical className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                                <span>{field.label}</span>
                                {field.type === 'number' && (
                                    <span className="text-xs opacity-75 ml-1">📊</span>
                                )}
                                <button
                                    onClick={() => onRemove(field, index)}
                                    className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                                    title="Remover campo"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
