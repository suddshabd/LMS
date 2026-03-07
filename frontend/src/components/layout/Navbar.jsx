import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    UserButton,
    SignInButton,
} from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import Button from "../ui/Button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme, appUser } = useContext(AppContext);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const isAdmin = appUser?.role === "admin";
    const isInstructor = appUser?.role === "instructor";

    return (
        <nav
            className={`${theme === "dark"
                    ? "bg-gray-900 border-b border-gray-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-800"
                } shadow-lg sticky top-0 z-50 transition-colors`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="PIB BITS" className="h-12 object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div
                        className={`hidden md:flex items-center gap-8 ${theme === "dark" ? "text-gray-300" : "text-white"
                            }`}
                    >
                        <Link to="/" className="hover:opacity-80 transition">
                            Home
                        </Link>

                        <Link to="/explore" className="hover:opacity-80 transition">
                            Explore
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`px-3 py-2 rounded-lg transition ${theme === "dark"
                                    ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                                    : "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                                }`}
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        {/* Signed Out */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="secondary" size="sm">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>

                        {/* Signed In */}
                        <SignedIn>
                            <Link to="/dashboard" className="hover:opacity-80 transition">
                                Dashboard
                            </Link>

                            {/* Admin Link */}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-yellow-400 font-semibold hover:opacity-80 transition"
                                >
                                    Admin
                                </Link>
                            )}

                            {/* Instructor Link */}
                            {isInstructor && (
                                <Link
                                    to="/creator"
                                    className="text-green-400 font-semibold hover:opacity-80 transition"
                                >
                                    Creator
                                </Link>
                            )}

                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-10 h-10",
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className={`px-3 py-2 rounded-lg ${theme === "dark"
                                    ? "bg-yellow-500 text-gray-900"
                                    : "bg-gray-700 text-yellow-300"
                                }`}
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-2xl text-white"
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        className={`md:hidden pb-4 space-y-3 ${theme === "dark" ? "text-gray-300" : "text-white"
                            }`}
                    >
                        <Link to="/" className="block py-2">
                            Home
                        </Link>

                        <Link to="/explore" className="block py-2">
                            Explore
                        </Link>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="secondary" size="sm" className="w-full">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>

                        <SignedIn>
                            <Link to="/dashboard" className="block py-2">
                                Dashboard
                            </Link>

                            {isAdmin && (
                                <Link to="/admin" className="block py-2 text-yellow-400">
                                    Admin
                                </Link>
                            )}

                            {isInstructor && (
                                <Link to="/creator" className="block py-2 text-green-400">
                                    Creator
                                </Link>
                            )}
                        </SignedIn>
                    </div>
                )}
            </div>
        </nav>
    );
}