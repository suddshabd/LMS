import React from 'react';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className={`bg-white rounded-xl shadow-2xl ${sizes[size]} w-full transform transition-all animate-scale-up`}>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}
