import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeCard from "./RecipeCard";

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://localhost:7238/api/recipes/my-recipes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipes(response.data);
            } catch (err) {
                setError("Failed to fetch your recipes. Please try again.");
            }
        };

        fetchMyRecipes();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit-recipe/${id}`);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
                <button
                    onClick={() => navigate("/create-recipe")}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    Create Recipe
                </button>
            </div>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            {recipes.length > 0 ? (
                <div className="grid-cols-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onEdit={handleEdit}
                            showEditButton={true}
                            showSaveButton={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-10 text-center">
                    <p className="text-lg text-gray-600">You haven't created any recipes yet.</p>
                    <button
                        onClick={() => navigate("/create-recipe")}
                        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                    >
                        Create Your First Recipe
                    </button>
                </div>
            )}
        </div>
    );
}

export default MyRecipes;
