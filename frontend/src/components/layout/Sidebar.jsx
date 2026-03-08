import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className="bg-[#111b31] text-white w-64 min-h-screen p-8 hidden lg:block">
            <h2 className="font-bold text-3xl mb-6">Resources</h2>
            <nav className="space-y-3 text-2xl">
                <Link to="/resources#blog" className="block hover:text-gray-200 transition-colors">Blog</Link>
                <Link to="/resources#tips" className="block hover:text-gray-200 transition-colors">Study Tips</Link>
                <Link to="/resources#stories" className="block hover:text-gray-200 transition-colors">Success Stories</Link>
                <Link to="/resources#faq" className="block hover:text-gray-200 transition-colors">FAQ</Link>
            </nav>
        </aside>
    );
}
