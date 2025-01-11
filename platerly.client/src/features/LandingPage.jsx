import React from "react";
import { useNavigate } from "react-router-dom";
import ProgressiveLoginPopup from "../components/ProgressiveLoginPopup";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-6">
            {/* Hero Section */}
            <section className="my-10 text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-800">
                    Welcome to Platerly
                </h1>
                <p className="mb-6 text-gray-600">
                    Discover, create, and share recipes in a whole new way. Join a community of food lovers and make cooking fun!
                </p>
                <div>
                    <button
                        onClick={() => navigate("/register")}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow hover:bg-orange-600 mr-4"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => navigate("/recipes")}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-gray-300"
                    >
                        Explore Recipes
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="my-16 text-center">
                <h2 className="mb-8 text-3xl font-bold text-gray-800">Why Platerly?</h2>
                <div className="grid-cols-1 grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="text-xl font-bold text-orange-500">Create Recipes</h3>
                        <p className="text-gray-600">
                            Share your original creations with the world and inspire others.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-orange-500">Remix Recipes</h3>
                        <p className="text-gray-600">
                            Put your spin on existing recipes and share your unique take.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-orange-500">Save Favorites</h3>
                        <p className="text-gray-600">
                            Bookmark your favorite recipes and revisit them anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="my-16 text-center">
                <h2 className="mb-8 text-3xl font-bold text-gray-800">
                    Join a Community of Food Lovers
                </h2>
                <p className="mx-auto max-w-3xl text-gray-600">
                    Connect with others, share ideas, and make cooking more exciting. Whether you're a beginner or a seasoned chef, there's a place for you here.
                </p>
            </section>

            {/* Footer */}
            <footer className="my-10 text-center text-gray-600">
                <p>&copy; 2024 Platerly. All rights reserved.</p>
                <nav className="mt-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-orange-500 hover:underline mx-2"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="text-orange-500 hover:underline mx-2"
                    >
                        Register
                    </button>
                    <button
                        onClick={() => navigate("/recipes")}
                        className="text-orange-500 hover:underline mx-2"
                    >
                        Explore Recipes
                    </button>
                </nav>
            </footer>
            <ProgressiveLoginPopup/>
        </div>
    );
}

export default LandingPage;
