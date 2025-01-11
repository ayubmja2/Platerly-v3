import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";

function Feed() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    const handleCardClick = (recipeId) => {
        if (window.location.pathname !== `/recipe/${recipeId}`) {
            navigate(`/recipe/${recipeId}`, { replace: false });
        }
    }

    const loadRecipes = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/recipes?page=${page}&size=10`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.recipes && data.recipes.length > 0) {
                setRecipes((prevRecipes) => {
                    const newRecipes = data.recipes.filter(
                        (recipe) => !prevRecipes.some((r) => r.id === recipe.id)
                    );
                    return [...prevRecipes, ...newRecipes]
                });
                setPage((prevPage) => prevPage + 1);
            } else {
                setHasMore(false); // No more recipes to load
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, isLoading, hasMore]);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 500
        ) {
            loadRecipes();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="space-y-6">
            {recipes.length > 0 ? (
                recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        showSaveButton={true} // Allow users to save recipes
                        showEditButton={false} // No edit button for the public feed
                        onCardClick={() => handleCardClick(recipe.id)}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500">
                    No recipes available.
                </p>
            )}

            {isLoading && (
                <div className="text-center text-gray-500">
                    Loading more recipes...
                </div>
            )}

            {!hasMore && recipes.length > 0 && (
                <div className="text-center text-gray-500">
                    You've reached the end of the feed.
                </div>
            )}
        </div>
    );
}

export default Feed;
