import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) {
    const { theme } = useContext(AppContext);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div
                className={`rounded-xl shadow-2xl ${sizes[size]} w-full transform transition-all animate-scale-up ${theme === 'dark'
                    ? 'bg-gray-900 text-gray-100 border border-gray-800'
                    : 'bg-white text-gray-900'
                    }`}
            >

                {/* Header */}
                <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h2>
                    <button
                        onClick={onClose}
                        className={`text-2xl font-light transition-colors rounded-full w-8 h-8 flex items-center justify-center ${theme === 'dark'
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className={theme === 'dark' ? 'p-6 text-gray-100' : 'p-6 text-gray-900'}>
                    {children}
                </div>

            </div>
        </div>
    );
}
