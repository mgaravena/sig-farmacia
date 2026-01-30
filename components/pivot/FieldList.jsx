'use client';

import { GripVertical } from 'lucide-react';

export default function FieldList({ fields, onDragStart }) {
    return (
        <div className="space-y-2">
            {fields.map(field => (
                <div
                    key={field.key}
                    draggable
                    onDragStart={(e) => onDragStart(e, field)}
                    className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-move group"
                >
                    <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {field.label}
                        </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                        field.type === 'number' 
                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                            : field.type === 'date'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                        {field.type}
                    </span>
                </div>
            ))}
        </div>
    );
}
