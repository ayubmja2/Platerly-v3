import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // Check if the response is OK
            if (!response.ok) {
                const errorText = await response.text();
                const errorData = errorText ? JSON.parse(errorText) : { message: "Registration failed" };
                throw new Error(errorData.message || "An unexpected error occurred.");
            }

            const data = await response.json();

            // Check if token exists before proceeding
            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log("Registration successful:", data);
                navigate("/onboarding"); // Redirect to onboarding
            } else {
                throw new Error("Token missing from response.");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-800">Create an Account</h1>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
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
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                    </div>
                    {/* Password */}
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
                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-orange-500 px-4 py-2 font-medium text-white shadow hover:bg-orange-600"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-sm text-gray-500">
                    Already have an account?{" "}
                    <a href="/login" className="text-orange-500 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
