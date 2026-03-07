import React from 'react';

export default function Sidebar() {
    return (
        <aside className="bg-gray-100 w-64 min-h-screen p-6 hidden lg:block">
            <h2 className="font-bold text-xl mb-6">Menu</h2>
            <nav className="space-y-4">
                <a href="/" className="block p-3 rounded hover:bg-gray-200">Dashboard</a>
                <a href="/explore" className="block p-3 rounded hover:bg-gray-200">Explore PDFs</a>
                <a href="/dashboard" className="block p-3 rounded hover:bg-gray-200">My Courses</a>
                <a href="/creator" className="block p-3 rounded hover:bg-gray-200">Creator Panel</a>
                <a href="/admin" className="block p-3 rounded hover:bg-gray-200">Admin Panel</a>
            </nav>
        </aside>
    );
}
