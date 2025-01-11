import React from "react";

const cookingLevels = [
    { id: "beginner", label: "Beginner", description: "I'm just starting to cook" },
    { id: "intermediate", label: "Intermediate", description: "I can follow most recipes" },
    { id: "advanced", label: "Advanced", description: "I'm comfortable with complex recipes" },
];

export default function CookingLevelStep({ preferences, setPreferences, nextStep }) {
    const handleLevelChange = (level) => {
        setPreferences((prev) => ({ ...prev, cookingLevel: level }));
    };

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold">How would you describe your cooking experience?</h2>
            <p className="mb-6 text-gray-500">This helps us recommend recipes at your comfort level.</p>
            <div className="grid-cols-1 grid gap-4">
                {cookingLevels.map((level) => (
                    <div
                        key={level.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${preferences.cookingLevel === level.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-orange-500"
                            }`}
                        onClick={() => handleLevelChange(level.id)}
                    >
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                ))}
            </div>

            <button
                onClick={nextStep}
                className="mt-6 w-full rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            >
                Next
            </button>
        </div>
    );
}
