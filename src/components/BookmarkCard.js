"use client";

import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const BookmarkCard = React.memo(({ bookmark, deleteBookmark }) => {
    const handleDelete = () => {
        // Trigger the delete function passed from parent
        deleteBookmark(bookmark.id);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bookmark.url);
        toast.success("URL copied to clipboard!");
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 truncate pr-4" title={bookmark.title}>
                        {bookmark.title}
                    </h3>
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm truncate block mt-1 transition-colors"
                    >
                        {bookmark.url}
                    </a>
                    <p className="text-xs text-gray-400 mt-2">
                        {new Date(bookmark.created_at).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-gray-400 dark:text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all hover:scale-110 active:scale-95"
                        title="Copy URL"
                    >
                        📋
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-110 active:scale-95"
                        title="Delete"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Decorative gradient line at the bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl" />
        </motion.div>
    );
});

export default BookmarkCard;
