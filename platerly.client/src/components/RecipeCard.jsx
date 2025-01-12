import React from "react";
import PropTypes from "prop-types";

function RecipeCard({ recipe, onLikeToggle, onComment, onRepost, onShare, onCardClick }) {
    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(recipe.id);
        }
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        if (onLikeToggle) {
            onLikeToggle(recipe.id); // Notify parent to update backend and state
        }
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        if (onComment) {
            onComment(recipe.id);
        }
    };

    const handleRepostClick = (e) => {
        e.stopPropagation();
        if (onRepost) {
            onRepost(recipe.id);
        }
    };

    const handleShareClick = (e) => {
        e.stopPropagation();
        if (onShare) {
            onShare(recipe.id);
        }
    };

    return (
        <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm hover:shadow-md">
            {/* Header Section */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={recipe.userAvatar || "/default-user-avatar.png"}
                        alt="User avatar"
                        className="mr-3 h-12 w-12 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-800">{recipe.username || "Anonymous"}</p>
                    </div>
                </div>
            </div>

            {/* Recipe Content */}
            <div className="cursor-pointer" onClick={handleCardClick}>
                <h2 className="text-center text-2xl font-semibold text-gray-900">{recipe.title}</h2>
                <div className="my-4 flex justify-center">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="h-80 w-full max-w-md rounded-md object-center"
                    />
                </div>
            </div>

            {/* Social Section */}
            <div className="mt-8 flex items-center justify-center space-x-20 border-t pt-3">
                {/* Like Button */}
                <button
                    onClick={handleLikeClick}
                    className={`text-lg ${recipe.isLiked ? "text-red-600" : "text-gray-500"}`}
                >
                    {recipe.isLiked ? "❤️" : "🤍"} {recipe.likes || 0}
                </button>

                {/* Comment Button */}
                <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={handleCommentClick}
                >
                    💬 Comment
                </button>

                {/* Repost Button */}
                <button
                    className="text-green-500 hover:text-green-600"
                    onClick={handleRepostClick}
                >
                    🔄 Repost
                </button>

                {/* Share Button */}
                <button
                    className="text-gray-500 hover:text-gray-600"
                    onClick={handleShareClick}
                >
                    🔗 Share
                </button>
            </div>
        </div>
    );
}

RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string,
        userAvatar: PropTypes.string,
        username: PropTypes.string,
        likes: PropTypes.number.isRequired,
        isLiked: PropTypes.bool.isRequired,
    }).isRequired,
    onLikeToggle: PropTypes.func.isRequired,
    onComment: PropTypes.func,
    onRepost: PropTypes.func,
    onShare: PropTypes.func,
    onCardClick: PropTypes.func,
};

export default RecipeCard;
