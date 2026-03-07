import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Card({
    children,
    className = '',
    onClick,
    hoverable = false
}) {
    const { theme } = useContext(AppContext);

    return (
        <div
            className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} rounded-xl shadow-md p-6 transition-all duration-300 ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
