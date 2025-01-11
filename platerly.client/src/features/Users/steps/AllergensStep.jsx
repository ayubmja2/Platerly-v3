import React from "react";

const commonAllergens = [
    { id: "peanuts", label: "Peanuts" },
    { id: "tree-nuts", label: "Tree Nuts" },
    { id: "milk", label: "Milk" },
    { id: "egg", label: "Eggs" },
    { id: "soy", label: "Soy" },
    { id: "wheat", label: "Wheat" },
    { id: "fish", label: "Fish" },
    { id: "shellfish", label: "Shellfish" },
];

export default function AllergensStep({ preferences, setPreferences, nextStep, prevStep }) {
    const handleToggle = (allergen) => {
        const updatedAllergens = preferences.allergens.includes(allergen)
            ? preferences.allergens.filter((item) => item !== allergen)
            : [...preferences.allergens, allergen];
        setPreferences((prev) => ({ ...prev, allergens: updatedAllergens }));
    };

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold">Do you have any food allergies?</h2>
            <p className="mb-4 text-sm text-gray-500">
                Select all that apply. You can always update this later.
            </p>
            <div className="grid-cols-2 grid gap-4">
                {commonAllergens.map((allergen) => (
                    <label key={allergen.id} className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={preferences.allergens.includes(allergen.id)}
                            onChange={() => handleToggle(allergen.id)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <span>{allergen.label}</span>
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
                {/* Next Button */}
                <button
                    onClick={nextStep}
                    className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
