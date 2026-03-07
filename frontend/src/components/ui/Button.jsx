import React from 'react';

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    loading = false
}) {
    const baseClasses = 'font-semibold rounded transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400',
        secondary: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 border border-gray-400 shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400',
        success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} flex items-center justify-center gap-2`}
        >
            {loading && (
                <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
            )}            {children}
        </button>
    );
}