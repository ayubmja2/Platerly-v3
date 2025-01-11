import React from "react";
import Feed from "../components/Feed"; // Feed component to handle recipe feed
import ProgressiveLoginPopup from "../components/ProgressiveLoginPopup";

function HomePage() {
    return (
        <div className="mx-auto flex max-w-7xl flex-col p-6 lg:flex-row">
            {/* Left Column */}
            <div className="hidden w-1/4 pr-4 lg:block">
                {/* User Profile Section */}
                <div className="mb-6 rounded-lg bg-white p-4 shadow">
                    <img
                        src="/default-user-avatar.png" // Replace with dynamic user image later
                        alt="User Avatar"
                        className="mx-auto h-20 w-20 rounded-full"
                    />
                    <h2 className="mt-4 text-center text-lg font-bold">Username</h2>
                    <p className="text-center text-sm text-gray-500">Welcome back!</p>
                </div>

                {/* Pinned CookBooks Section */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="mb-3 text-lg font-bold">Pinned CookBooks</h3>
                    <ul className="space-y-2">
                        {/* Replace with actual pinned cookbooks */}
                        <li className="cursor-pointer text-orange-500 hover:underline">
                            My Favorite Recipes
                        </li>
                        <li className="cursor-pointer text-orange-500 hover:underline">
                            Vegan Dishes
                        </li>
                        <li className="cursor-pointer text-orange-500 hover:underline">
                            Dessert Ideas
                        </li>
                    </ul>
                </div>
            </div>

            {/* Center Column */}
            <div className="flex-1">
                {/* Feed Filters */}
                <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow">
                    <h1 className="text-2xl font-bold text-orange-500">Platerly</h1>
                    <div className="flex space-x-4">
                        <button className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
                            Discover
                        </button>
                        <button className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                            Following
                        </button>
                        <button className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                            Trending
                        </button>
                    </div>
                </div>

                {/* Feed */}
                <Feed />
            </div>

            {/* Right Column */}
            <div className="hidden w-1/4 pl-4 lg:block">
                {/* Search Bar */}
                <div className="mb-6 rounded-lg bg-white p-4 shadow">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                    />
                </div>

                {/* Trending Tags */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="mb-3 text-lg font-bold">Trending Tags</h3>
                    <ul className="space-y-2">
                        <li className="cursor-pointer text-orange-500 hover:underline">#Vegan</li>
                        <li className="cursor-pointer text-orange-500 hover:underline">#QuickMeals</li>
                        <li className="cursor-pointer text-orange-500 hover:underline">#Healthy</li>
                    </ul>
                </div>
            </div>

            <ProgressiveLoginPopup />
        </div>
    );
}

export default HomePage;
