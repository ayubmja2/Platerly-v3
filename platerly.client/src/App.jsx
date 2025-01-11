import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// Import pages
import LandingPage from "./features/LandingPage";
import HomePage from "./features/HomePage";
import RecipeDetails from "./components/RecipeDetails";
import Login from "./features/Users/Login";
import Register from "./features/Users/Register";
import Header from "./components/Header";
import RecipeSubmission from "./features/Recipes/RecipeSubmission";
import MyRecipes from "./components/MyRecipes";
import EditRecipe from "./components/EditRecipe";
import SavedRecipes from "./features/Recipes/SavedRecipes";
import Profile from "./features/Users/Profile";
import Onboarding from "./features/Users/Onboarding";

function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <Routes>
                {/* Header shown on all pages */}
                <Route path="/*" element={<Header />} />

                {/* Public Routes */}
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/recipes" replace /> : <LandingPage />}
                />
                <Route path="/recipes" element={<HomePage />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Private Routes */}
                <Route
                    path="/submit-recipe"
                    element={
                        <PrivateRoute>
                            <RecipeSubmission />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/my-recipes"
                    element={
                        <PrivateRoute>
                            <MyRecipes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-recipe/:id"
                    element={
                        <PrivateRoute>
                            <EditRecipe />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/saved-recipes"
                    element={
                        <PrivateRoute>
                            <SavedRecipes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/onboarding"
                    element={
                        <PrivateRoute>
                            <Onboarding />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
