import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AllergensStep from "./steps/AllergensStep";
import DietaryStep from "./steps/DietaryStep";
import CookingLevelStep from "./steps/CookingLevelStep";
import ProgressBar from "../../components/ProgressBar";

export default function Onboarding() {
    const [step, setStep] = useState(1); // Start with step 1 (Cooking Level)
    const totalSteps = 3;
    const navigate = useNavigate();

    const [preferences, setPreferences] = useState({
        cookingLevel: "beginner",
        allergens: [],
        dietaryRestrictions: [],
    });

    const nextStep = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token"); // Get the user's token
            const response = await fetch("/api/users/onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include the token for authorization
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error("Failed to save preferences");
            }

            alert("Onboarding complete!");
            navigate("/recipes");
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow">
                <h1 className="mb-4 text-2xl font-bold">Welcome to Platerly</h1>
                <p className="mb-6 text-gray-600">Let’s personalize your experience.</p>
                <ProgressBar current={step} total={totalSteps} />

                {step === 1 && (
                    <CookingLevelStep
                        preferences={preferences}
                        setPreferences={setPreferences}
                        nextStep={nextStep}
                    />
                )}
                {step === 2 && (
                    <AllergensStep
                        preferences={preferences}
                        setPreferences={setPreferences}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                )}
                {step === 3 && (
                    <DietaryStep
                        preferences={preferences}
                        setPreferences={setPreferences}
                        prevStep={prevStep}
                        handleSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}
