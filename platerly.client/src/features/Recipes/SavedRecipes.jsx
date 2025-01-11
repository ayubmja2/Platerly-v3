import React, { useEffect, useState } from 'react';
import RecipeCard from '../../components/RecipeCard';
import axios from 'axios';

function SavedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:7238/api/recipes/saved', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching saved recipes:', error);
                setError('Failed to load saved recipes.');
            }
        };

        fetchSavedRecipes();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">My Cookbook</h1>
                <button className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                    Create New Cookbook
                </button>
            </div>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            {recipes.length > 0 ? (
                <div className="grid-cols-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="mt-10 text-center">
                    <p className="text-lg text-gray-600">Your cookbook is empty!</p>
                    <button className="mt-4 rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                        Add Recipe
                    </button>
                </div>
            )}
        </div>
    );
}

export default SavedRecipes;
