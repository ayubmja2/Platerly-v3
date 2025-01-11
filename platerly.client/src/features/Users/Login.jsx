import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const data = await response.json();
            console.log("Login successful:", data);

            // Save the token to localStorage
            localStorage.setItem("token", data.token);

            // Redirect to the recipes page
            navigate("/recipes");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-800">Log In</h1>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username Field */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
                    {/* Login Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-orange-500 px-4 py-2 font-medium text-white shadow hover:bg-orange-600"
                        >
                            Log In
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="text-orange-500 hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
