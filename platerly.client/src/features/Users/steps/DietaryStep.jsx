import React from "react";

const dietaryRestrictions = [
    { id: "halal", label: "Halal" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "kosher", label: "Kosher" },
    { id: "dairy-free", label: "Dairy Free" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "low-carb", label: "Low Carb" },
    { id: "keto", label: "Keto" },
];

export default function DietaryStep({ preferences, setPreferences, prevStep, handleSubmit }) {
    const handleToggle = (dietary) => {
        const updatedDietary = preferences.dietaryRestrictions.includes(dietary)
            ? preferences.dietaryRestrictions.filter((item) => item !== dietary)
            : [...preferences.dietaryRestrictions, dietary];
        setPreferences((prev) => ({ ...prev, dietaryRestrictions: updatedDietary }));
    };

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold">Any dietary preferences?</h2>
            <div className="grid-cols-2 grid gap-4">
                {dietaryRestrictions.map((diet) => (
                    <label key={diet.id} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={preferences.dietaryRestrictions.includes(diet.id)}
                            onChange={() => handleToggle(diet.id)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <span>{diet.label}</span>
                    </label>
                ))}
            </div>
            <div className="mt-6 flex justify-between">
                {/* Back Button */}
                <button
                    onClick={prevStep}
                    className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                    Back
                </button>
                {/* Complete Setup Button */}
                <button
                    onClick={handleSubmit}
                    className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                >
                    Complete Setup
                </button>
            </div>
        </div>
    );
}
