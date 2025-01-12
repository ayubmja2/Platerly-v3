import React, { useState, useEffect, useCallback } from "react";
import RecipeCard from "./RecipeCard";
import CommentPopup from "./CommentPopup";
import { useNavigate } from "react-router-dom";

function Feed() {
    const [recipes, setRecipes] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isCommenting, setIsCommenting] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const navigate = useNavigate();

    const handleCommentClick = (recipeId) => {
        setSelectedRecipeId(recipeId);
        setIsCommenting(true);
    };

    const handleCommentSubmit = async (recipeId, commentContent, parentCommentId = null) => {
        try {
            const response = await fetch(`/api/recipes/${recipeId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    content: commentContent,
                    parentCommentId: parentCommentId, // Can be null for top-level comments
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to post comment");
            }

            console.log("Comment posted successfully!");
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };


    const handleCardClick = (recipeId) => {
        if (window.location.pathname !== `/recipe/${recipeId}`) {
            navigate(`/recipe/${recipeId}`, { replace: false });
        }
    };

    const toggleLike = async (recipeId) => {
        try {
            const response = await fetch(`/api/recipes/${recipeId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to toggle like status");
            }

            const data = await response.json();

            // Update the recipe state directly
            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe.id === recipeId
                        ? {
                            ...recipe,
                            isLiked: data.isLiked, // Update `isLiked` from backend
                            likes: data.totalLikes, // Update `likes` count from backend
                        }
                        : recipe
                )
            );
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const loadRecipes = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const response = await fetch(`/api/recipes?page=${page}&size=10`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach token if available
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.recipes && data.recipes.length > 0) {
                setRecipes((prevRecipes) => {
                    const newRecipes = data.recipes.filter(
                        (recipe) => !prevRecipes.some((r) => r.id === recipe.id)
                    );
                    return [...prevRecipes, ...newRecipes];
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
                        onLikeToggle={toggleLike} // Pass the toggleLike function
                        onComment={() => handleCommentClick(recipe.id)}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500">No recipes available.</p>
            )}

            {isLoading && (
                <div className="text-center text-gray-500">Loading more recipes...</div>
            )}

            {!hasMore && recipes.length > 0 && (
                <div className="text-center text-gray-500">You've reached the end of the feed.</div>
            )}

            {isCommenting && (
                <CommentPopup
                    recipeId={selectedRecipeId}
                    onClose={() => setIsCommenting(false)}
                    onSubmit={handleCommentSubmit}
                />
            )}
        </div>
    );
}

export default Feed;
