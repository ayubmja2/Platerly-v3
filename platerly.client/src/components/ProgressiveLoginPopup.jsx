import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProgressiveLoginPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const dismissedPopup = localStorage.getItem("dismissedPopup");

        console.log("ProgressiveLoginPopup: Checking visibility...");
        if (!token && !dismissedPopup) {
            console.log("ProgressiveLoginPopup: Popup is visible.");
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        console.log("ProgressiveLoginPopup: Popup dismissed.");
        setIsVisible(false);
        localStorage.setItem("dismissedPopup", "true"); // Remember for this session
    };

    const handleNavigation = (path) => {
        if (window.location.pathname !== path) {
            console.log(`ProgressiveLoginPopup: Navigating to ${path}`);
            navigate(path);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
            <button
                onClick={handleDismiss}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
                X
            </button>
            <p className="mb-2 font-semibold text-gray-800">
                Ready to get more from Platerly?
            </p>
            <p className="mb-4 text-sm text-gray-600">
                Sign in or create an account to save recipes and preferences.
            </p>
            <div className="flex space-x-2">
                <button
                    onClick={() => handleNavigation("/login")}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    Sign In
                </button>
                <button
                    onClick={() => handleNavigation("/register")}
                    className="bg-white text-orange-500 border border-orange-500 px-4 py-2 rounded hover:bg-orange-100"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default ProgressiveLoginPopup;
