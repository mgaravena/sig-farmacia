'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { key: 'light', label: 'Claro', icon: Sun },
        { key: 'dark', label: 'Oscuro', icon: Moon },
        { key: 'auto', label: 'Auto', icon: Monitor }
    ];

    return (
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            {themes.map(({ key, label, icon: Icon }) => (
                <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                        ${theme === key 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                    `}
                    title={label}
                >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    );
}
