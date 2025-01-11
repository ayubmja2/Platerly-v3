import React, { useState } from 'react';
import axios from 'axios';

function RecipeSubmission({ setRecipes = () => { }, recipes = [], parentRecipeId = null }) {
    const [formData, setFormData] = useState({
        title: '',
        ingredients: [{ ingredient: '', amount: '', unit: '' }],
        instructions: '',
        allergens: [],
        dietaryTags: [],
        cookingTime: '',
        servings: '',
        cookingLevel: '', // Added cookingLevel field
        image: null,
        parentRecipeId: parentRecipeId, // For remixing, null by default
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, image: null });
            setImagePreview(null);
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index][field] = value;
        setFormData({ ...formData, ingredients: updatedIngredients });
    };

    const addIngredientField = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { ingredient: '', amount: '', unit: '' }],
        });
    };

    const removeIngredientField = (index) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: updatedIngredients });
    };

    const handleCheckboxChange = (field, value) => {
        const updatedList = formData[field].includes(value)
            ? formData[field].filter((item) => item !== value)
            : [...formData[field], value];
        setFormData({ ...formData, [field]: updatedList });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
        formDataToSend.append('instructions', formData.instructions);
        formDataToSend.append('allergens', JSON.stringify(formData.allergens));
        formDataToSend.append('dietaryTags', JSON.stringify(formData.dietaryTags));
        formDataToSend.append('cookingTime', formData.cookingTime);
        formDataToSend.append('servings', formData.servings);
        formDataToSend.append('cookingLevel', formData.cookingLevel); // Added cookingLevel field
        formDataToSend.append('parentRecipeId', formData.parentRecipeId);
        formDataToSend.append('image', formData.image);

        try {
            const response = await axios.post('/api/recipes', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedRecipes = Array.isArray(recipes) ? [response.data, ...recipes] : [response.data];
            setRecipes(updatedRecipes);

            setSuccess('Recipe submitted successfully!');
            setFormData({
                title: '',
                ingredients: [{ ingredient: '', amount: '', unit: '' }],
                instructions: '',
                allergens: [],
                dietaryTags: [],
                cookingTime: '',
                servings: '',
                cookingLevel: '', // Reset cookingLevel
                image: null,
                parentRecipeId: null,
            });
            setImagePreview(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit recipe.');
        }
    };

    return (
        <div className="mx-auto mt-6 max-w-4xl rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Create Recipe</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Recipe Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-md border p-2"
                        required
                    />
                </div>

                <div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label className="mb-2 block font-medium text-gray-700">Cooking Time (minutes)</label>
                        <input
                            type="number"
                            name="cookingTime"
                            value={formData.cookingTime}
                            onChange={handleChange}
                            className="w-full rounded-md border p-2"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="mb-2 block font-medium text-gray-700">Servings</label>
                        <input
                            type="number"
                            name="servings"
                            value={formData.servings}
                            onChange={handleChange}
                            className="w-full rounded-md border p-2"
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Cooking Level</label>
                    <select
                        name="cookingLevel"
                        value={formData.cookingLevel}
                        onChange={handleChange}
                        className="w-full rounded-md border p-2"
                        required
                    >
                        <option value="">Select Difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Ingredients</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="mb-2 flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Ingredient"
                                value={ingredient.ingredient}
                                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                                className="w-1/3 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Amount"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                className="w-1/4 p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Unit (e.g., cups)"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                className="w-1/4 p-2 border rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredientField(index)}
                                className="text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addIngredientField}
                        className="font-medium text-orange-500 hover:underline"
                    >
                        + Add Ingredient
                    </button>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Instructions</label>
                    <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        className="w-full rounded-md border p-2"
                        rows="4"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Recipe Image</label>
                    <div className="rounded-md border border-dashed border-gray-400 p-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full"
                        />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-4 max-h-48 rounded-md" />
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Allergens</label>
                    <div className="grid-cols-4 grid gap-2">
                        {['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'].map((allergen) => (
                            <label key={allergen} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={allergen}
                                    checked={formData.allergens.includes(allergen)}
                                    onChange={() => handleCheckboxChange('allergens', allergen)}
                                    className="rounded border-gray-300"
                                />
                                <span>{allergen}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-2 block font-medium text-gray-700">Dietary Tags</label>
                    <div className="grid-cols-4 grid gap-2">
                        {['Vegan', 'Vegetarian', 'Halal', 'Kosher', 'Paleo', 'Keto'].map((tag) => (
                            <label key={tag} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={tag}
                                    checked={formData.dietaryTags.includes(tag)}
                                    onChange={() => handleCheckboxChange('dietaryTags', tag)}
                                    className="rounded border-gray-300"
                                />
                                <span>{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full rounded-md bg-orange-500 py-2 text-white">
                    Create Recipe
                </button>
            </form>
        </div>
    );
}

export default RecipeSubmission;
