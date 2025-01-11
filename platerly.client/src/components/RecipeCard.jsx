import React, { useState } from "react";
import PropTypes from "prop-types";


function RecipeCard({ recipe, onEdit, showEditButton, showSaveButton, onCardClick }) {
    const [liked, setLiked] = useState(false);
    //const navigate = useNavigate();

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(recipe.id);
        }
    }

    const handleLikeToggle = () => {
        setLiked(!liked);
    };

    const handleSaveRecipe = () => {
        alert("Recipe saved successfully!");
    };

    // Ensure allergens and dietaryTags are arrays
    const allergens = Array.isArray(recipe.allergens)
        ? recipe.allergens
        : recipe.allergens
            ? JSON.parse(recipe.allergens)
            : [];
    const dietaryTags = Array.isArray(recipe.dietaryTags)
        ? recipe.dietaryTags
        : recipe.dietaryTags
            ? JSON.parse(recipe.dietaryTags)
            : [];

    return (
        <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm hover:shadow-md" onClick={handleCardClick}>
            {/* Header Section: Title and User */}
            <div className="mb-3 flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center">
                    <img
                        src={recipe.userAvatar || "/default-user-avatar.png"}
                        alt="User avatar"
                        className="mr-3 h-12 w-12 rounded-full"
                    />
                    <div>
                        <p className="ml-4 text-sm font-medium text-gray-800">{recipe.username || "Anonymous"}</p>
                        {/*<p className="text-xs text-gray-500">{recipe.timestamp || "N/A"}</p>*/}
                    </div>
                </div>
                {/* Save Button */}
                {showSaveButton && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSaveRecipe();
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md text-sm"
                    >
                        Save
                    </button>
                )}
            </div>

            {/* Recipe Content */}
            <div className="mb-4 cursor-pointer" onClick={onCardClick}>
                <h2 className="text-center text-2xl font-semibold text-gray-900">{recipe.title}</h2>
                {/*<div className="mt-1 flex items-center text-sm text-gray-600">*/}
                {/*    <span>{recipe.cookingTime || "N/A"} mins</span>*/}
                {/*    <span className="mx-2">·</span>*/}
                {/*    <span>{recipe.servings || "N/A"} servings</span>*/}
                {/*</div>*/}
                <div className="my-4 flex justify-center">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="h-80 w-full max-w-md rounded-md object-center"
                    />
                </div>
            </div>

            {/* Tags Section */}
            <div className="flex items-center justify-between">
                {/* Allergens */}
                <div className="flex items-center">
                    <strong className="mr-2 text-sm text-gray-600">Allergens:</strong>
                    {allergens.length > 0 ? (
                        allergens.map((allergen, idx) => (
                            <span
                                key={idx}
                                className="mr-2 inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-600"
                            >
                                {allergen}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-600">None</span>
                    )}
                </div>

                {/* Dietary Tags */}
                <div className="flex items-center justify-end">
                    {dietaryTags.length > 0 ? (
                        dietaryTags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="mr-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-600"
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-600">None</span>
                    )}
                    <strong className="ml-2 text-sm text-gray-600">Dietary</strong>
                </div>
            </div>

            {/* Social Section */}
            <div className="mt-8 flex items-center justify-center space-x-20 border-t pt-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLikeToggle();
                    }}
                    className={`text-lg ${liked ? "text-red-600" : "text-gray-500"}`}
                >
                    {liked ? "❤️" : "🤍"} {liked ? recipe.likes + 1 : recipe.likes}
                </button>
                <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                >
                    💬
                </button>
                <button
                    className="text-green-500 hover:text-green-600"
                    onClick={(e) => e.stopPropagation()}
                >
                    🔄
                </button>
                <button
                    className="text-gray-500 hover:text-gray-600"
                    onClick={(e) => e.stopPropagation()}
                >
                    🔗
                </button>
            </div>
        </div>
    );
}

// Prop Types for validation
RecipeCard.propTypes = {
    recipe: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        cookingTime: PropTypes.string,
        servings: PropTypes.string,
        allergens: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        dietaryTags: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        image: PropTypes.string,
        username: PropTypes.string,
        userAvatar: PropTypes.string,
        likes: PropTypes.number,
    }).isRequired,
    onEdit: PropTypes.func,
    showEditButton: PropTypes.bool,
    showSaveButton: PropTypes.bool,
    onCardClick: PropTypes.func,
};

export default RecipeCard;
