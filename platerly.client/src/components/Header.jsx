import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Explicitly navigate to the landing page
    };

    const handleLogoClick = () => {
        if (isAuthenticated) {
            navigate("/recipes"); // Redirect to feed for logged-in users
        } else {
            navigate("/"); // Redirect to landing page for logged-out users
        }
    };

    return (
        <header className="bg-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                {/* Logo */}
                <button
                    onClick={handleLogoClick}
                    className="text-2xl font-bold text-orange-500 focus:outline-none"
                >
                    Platerly
                </button>

                {/* Navigation Links */}
                <nav className="flex items-center space-x-4">
                    <Link
                        to="/recipes"
                        className="text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Recipes
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/saved-recipes"
                                className="text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                CookBook
                            </Link>
                            <Link
                                to="/my-recipes"
                                className="text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                My Recipes
                            </Link>
                            <Link
                                to="/submit-recipe"
                                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600"
                            >
                                Create Recipe
                            </Link>
                            {/* User Avatar */}
                            <img
                                src="/default-user-avatar.png"
                                alt="User Avatar"
                                className="ml-4 h-8 w-8 cursor-pointer rounded-full border border-gray-300"
                                onClick={() => navigate("/profile")}
                            />
                            <button
                                onClick={handleLogout}
                                className="ml-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-md border border-orange-500 px-4 py-1 text-sm font-medium text-orange-500 hover:bg-orange-100"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
