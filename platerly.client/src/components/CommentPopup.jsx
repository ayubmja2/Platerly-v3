import React, { useState } from "react";

function CommentPopup({ recipeId, onClose, onSubmit }) {
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (comment.trim()) {
            onSubmit(recipeId, comment); // Pass the recipeId and comment to the parent
            setComment("");
            onClose(); // Close the popup
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
                <button
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    X
                </button>
                <h2 className="mb-4 text-lg font-semibold">Write a comment</h2>
                <textarea
                    className="h-20 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-orange-500"
                    placeholder="Write your reply here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                        onClick={handleSubmit}
                    >
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentPopup;
