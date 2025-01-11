import React from "react";

export default function ProgressBar({ current, total }) {
    const percentage = (current / total) * 100;

    return (
        <div className="relative h-2 w-full rounded bg-gray-200">
            <div
                className="absolute left-0 top-0 h-2 rounded bg-orange-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
