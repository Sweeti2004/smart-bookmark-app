"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AddBookmarkForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    const handleSubmit = () => {
        onAdd(title, url, () => {
            setTitle("");
            setUrl("");
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-xl shadow-indigo-500/5 rounded-2xl p-6 sm:p-8"
        >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <span className="text-indigo-500">✨</span> Add New Bookmark
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-4">
                    <input
                        type="text"
                        placeholder="Bookmark Title (e.g. My Favorite Blog)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-slate-500 hover:bg-white dark:hover:bg-slate-800"
                    />
                    <input
                        type="text"
                        placeholder="URL (https://...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-slate-500 hover:bg-white dark:hover:bg-slate-800"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="h-auto md:w-32 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center p-4 md:p-0"
                >
                    Save
                </button>
            </div>
        </motion.div>
    );
}
