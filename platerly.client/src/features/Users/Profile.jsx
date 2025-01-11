import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
    const [user, setUser] = useState({
        name: "John Doe",
        username: "@johndoe",
        profilePicture: "/default-user-avatar.png",
        bannerImage: "/default-banner.jpg", // Optional
        stats: {
            recipes: 12,
            remix: 5, // Number of remixed recipes
            followers: 120,
        },
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://localhost:7238/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                setError("Failed to fetch profile.");
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="container mx-auto p-6">
            {/* Banner Section */}
            <div className="relative mb-6">
                <img
                    src={user.bannerImage}
                    alt="Profile Banner"
                    className="h-48 w-full rounded-lg object-cover"
                />
                <div className="bottom-[-40px] absolute left-6">
                    <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="border-4 h-20 w-20 rounded-full border-white"
                    />
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-500">{user.username}</p>
                </div>
                <button className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                    Edit Profile
                </button>
            </div>

            {/* Stats Section */}
            <div className="mb-6 flex space-x-8 text-center">
                <div>
                    <p className="text-lg font-bold text-gray-800">{user.stats.recipes}</p>
                    <p className="text-sm text-gray-500">Recipes</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-800">{user.stats.remix}</p>
                    <p className="text-sm text-gray-500">Remix</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-800">{user.stats.followers}</p>
                    <p className="text-sm text-gray-500">Followers</p>
                </div>
            </div>

            {/* Content Tabs */}
            <div>
                <div className="mb-4 flex space-x-4 border-b">
                    <button className="border-b-2 border-orange-500 pb-2 text-orange-500">
                        Recipes
                    </button>
                    <button className="pb-2 text-gray-600 hover:text-gray-800">
                        Remix
                    </button>
                    <button className="pb-2 text-gray-600 hover:text-gray-800">
                        About Me
                    </button>
                </div>

                {/* Content Section */}
                <div>
                    {/* Replace this with dynamic content for the selected tab */}
                    <p className="text-gray-500">This is where the tab content will appear.</p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
