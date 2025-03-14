// components/CreateJobModal.jsx
'use client';

import { useState } from "react";

export default function CreateJobModal({ onClose, onJobCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });
        const data = await res.json();
        if (data.success) {
            onJobCreated(data.job);
            onClose();
        } else {
            setError(data.error || "Failed to create job");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Create New Job</h2>
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                        required
                    />
                    <textarea
                        placeholder="Job Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                        required
                    ></textarea>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
