import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

function RecipeDetails() {
    const { id } = useParams(); // Extract recipe ID from URL
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigation = useNavigate();
    

    useEffect(() => {
        console.log("Current URL:", location.pathname);
        console.log("History Length", window.history.length);
        console.log("State in History", window.history.state);
    }, [location])



    useEffect(() => {
        let isMounted = true; // Track if the component is mounted
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`/api/recipes/${id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                if (isMounted) {
                    setRecipe(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchRecipe();

        // Cleanup function to prevent state updates on unmounted components
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return <p>Loading recipe...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!recipe) {
        return <p>Recipe not found.</p>;
    }

    return (
        <div className="recipe-details space-y-6">
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <img
                src={recipe.image}
                alt={recipe.title}
                className="mx-auto w-full max-w-md rounded-lg"
            />
            <div className="text-gray-700">
                <h2 className="font-semibold">Ingredients:</h2>
                <ul className="list-disc pl-5">
                    {recipe.ingredients.split("\n").map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <h2 className="mt-4 font-semibold">Instructions:</h2>
                <p>{recipe.instructions}</p>
            </div>
            {/* Interaction Buttons */}
            <div className="interactions space-y-4">
                <button className="like-btn rounded bg-blue-500 px-4 py-2 text-white">
                    Like
                </button>
                <button className="comment-btn rounded bg-green-500 px-4 py-2 text-white">
                    Comment
                </button>
                <button className="repost-btn rounded bg-purple-500 px-4 py-2 text-white">
                    Repost
                </button>
                <button className="share-btn rounded bg-gray-500 px-4 py-2 text-white">
                    Share
                </button>
            </div>
            <button
                onClick={() => navigation(-1)} className="back-btn mt-4 rounded bg-gray-300 px-4 py-2">
                Go back
            </button>
        </div>
    );
}

export default RecipeDetails;
