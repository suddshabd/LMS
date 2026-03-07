import React from 'react';

export default function Badge({
    children,
    variant = 'primary',
    size = 'md'
}) {
    const variants = {
        primary: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
        success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
        warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300',
        danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
        gray: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <span
            className={`inline-block rounded-full font-semibold transition-all ${variants[variant]} ${sizes[size]}`}
        >
            {children}
        </span>
    );
}
