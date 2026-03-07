import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

export default function Footer() {
    const { theme } = useContext(AppContext);

    return (
        <footer className={`${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-900 text-gray-300'} py-12 mt-16 transition-colors`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="PIB BITS" className="h-10 object-contain" />
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Igniting potential, building futures with premium exam preparation materials.</p>
                        <div className="flex gap-4">
                            <a
                                href="https://t.me/PIB_Bits"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Telegram"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                                    <path d="M9.78 18.65 9.93 14.5l7.56-6.82c.33-.3-.07-.47-.5-.18l-9.35 5.9-4.04-1.27c-.88-.27-.9-.88.18-1.3L19.53 4.8c.74-.27 1.39.18 1.15 1.3l-2.67 12.58c-.2.89-.74 1.1-1.5.69l-4.15-3.06-2 1.94c-.22.22-.4.4-.83.4h-.75z" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/@pib_bits?si=qR6s5ayP7enGc4G4"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="YouTube"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                                </svg>
                            </a>
                            <a
                                href="mailto:pibquery247@gmail.com"
                                aria-label="Email"
                                className="text-gray-400 hover:text-white transition"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                                    <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.5l9 5.6 9-5.6V7H3Zm18 10V9.9l-8.47 5.27a1 1 0 0 1-1.06 0L3 9.9V17h18Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Courses</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/explore" className="hover:text-white transition">Banking Exams</Link></li>
                            <li><Link to="/explore" className="hover:text-white transition">SSC Exams</Link></li>
                            <li><Link to="/explore" className="hover:text-white transition">Railway Exams</Link></li>
                            <li><Link to="/explore" className="hover:text-white transition">UPSC</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition">Study Tips</a></li>
                            <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
                            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="mailto:pibquery247@gmail.com" className="hover:text-white transition">Email Support</a></li>
                            <li><a href="#" className="hover:text-white transition">Live Chat</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Feedback</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Disclaimer</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400 mb-4 md:mb-0">
                        © 2025 PIB BITS. All rights reserved. Made with ❤️ for exam aspirants.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition">Sitemap</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
