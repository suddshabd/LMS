import React, { useState, useContext, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
    UserButton,
    useAuth,
    useClerk,
} from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import Button from "../ui/Button";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef(null);
    const { theme, setTheme, appUser } = useContext(AppContext);
    const { isLoaded, isSignedIn } = useAuth();
    const clerk = useClerk();

    useLayoutEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            gsap.from(".nav-logo", {
                opacity: 0,
                y: -14,
                duration: 0.45,
                ease: "power2.out",
            });

            gsap.from(".nav-item", {
                opacity: 0,
                y: -10,
                stagger: 0.06,
                duration: 0.4,
                ease: "power2.out",
                delay: 0.08,
            });
        }, navRef);

        return () => ctx.revert();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const isAdmin = appUser?.role === "admin";
    const isInstructor = appUser?.role === "instructor";
    const shouldShowSignIn = !isSignedIn;

    const handleSignInClick = async () => {
        try {
            if (!isLoaded) {
                return;
            }

            await clerk.redirectToSignIn({
                returnBackUrl: window.location.href,
            });
        } catch {
            clerk.redirectToSignIn({
                returnBackUrl: window.location.href,
            });
        }
    };

    return (
        <nav
            ref={navRef}
            className={`${theme === "dark"
                    ? "bg-gray-900 border-b border-gray-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-800"
                } shadow-lg sticky top-0 z-50 transition-colors`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 nav-logo">
                        <img src="/logo.png" alt="PIB BITS" className="h-12 object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <div
                        className={`hidden md:flex items-center gap-8 ${theme === "dark" ? "text-gray-300" : "text-white"
                            }`}
                    >
                        <Link to="/" className="hover:opacity-80 transition nav-item">
                            Home
                        </Link>

                        <Link to="/explore" className="hover:opacity-80 transition nav-item">
                            Explore
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`px-3 py-2 rounded-lg transition nav-item ${theme === "dark"
                                    ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                                    : "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                                }`}
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        {shouldShowSignIn && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleSignInClick}
                                className="nav-item"
                            >
                                Sign In
                            </Button>
                        )}

                        {!shouldShowSignIn && (
                            <>
                            <Link to="/dashboard" className="hover:opacity-80 transition nav-item">
                                Dashboard
                            </Link>

                            {/* Admin Link */}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-yellow-400 font-semibold hover:opacity-80 transition nav-item"
                                >
                                    Admin
                                </Link>
                            )}

                            {/* Instructor Link */}
                            {isInstructor && (
                                <Link
                                    to="/creator"
                                    className="text-green-400 font-semibold hover:opacity-80 transition nav-item"
                                >
                                    Creator
                                </Link>
                            )}

                            <div className="nav-item">
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-10 h-10",
                                        },
                                    }}
                                />
                            </div>
                            </>
                        )}
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

                        {!shouldShowSignIn && (
                            <UserButton afterSignOutUrl="/" />
                        )}

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

                        {shouldShowSignIn && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="w-full"
                                onClick={handleSignInClick}
                            >
                                Sign In
                            </Button>
                        )}

                        {!shouldShowSignIn && (
                            <>
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
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
