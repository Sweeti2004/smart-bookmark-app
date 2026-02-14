"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import validator from "validator";

export default function AddBookmarkForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const formatAndValidateUrl = (value) => {
        let formatted = value.trim();
        if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
            formatted = "https://" + formatted;
        }
        const isValid = validator.isURL(formatted, {
            protocols: ["http", "https"],
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
            require_tld: true,
            allow_underscores: false,
        });
        return isValid ? formatted : null;
    };

    const handleSubmit = async () => {
        setError("");
        setVerificationSuccess(false);

        if (!title.trim() || !url.trim()) {
            setError("Title and URL are required.");
            return;
        }

        const formattedUrl = formatAndValidateUrl(url);
        if (!formattedUrl) {
            setError("Invalid URL format. Please check the syntax.");
            return;
        }

        setIsVerifying(true);

        try {
            const res = await fetch("/api/verify-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: formattedUrl }),
            });
            const data = await res.json();

            if (data.valid) {
                setVerificationSuccess(true);
                // Short delay to show the success state before saving
                setTimeout(() => {
                    onAdd(title.trim(), formattedUrl, () => {
                        setTitle("");
                        setUrl("");
                        setIsVerifying(false);
                        setVerificationSuccess(false);
                    });
                }, 800);
            } else {
                setError(data.message || "URL is invalid or unreachable.");
                setIsVerifying(false);
            }
        } catch (err) {
            setError("Failed to verify URL. Please try again.");
            setIsVerifying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-xl shadow-indigo-500/5 rounded-2xl p-6 sm:p-8"
        >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6 transition-colors">
                ✨ Add New Bookmark
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-4 w-full">
                    <input
                        type="text"
                        placeholder="Bookmark Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isVerifying}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-slate-500 disabled:opacity-50"
                    />

                    <div className="relative">
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError("");
                                setVerificationSuccess(false);
                            }}
                            disabled={isVerifying}
                            className={`w-full p-4 rounded-xl border bg-gray-50 dark:bg-slate-800/50 outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-slate-500 disabled:opacity-50 ${error
                                ? "border-red-400 focus:ring-2 focus:ring-red-400"
                                : verificationSuccess
                                    ? "border-green-400 focus:ring-2 focus:ring-green-400"
                                    : "border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-400"
                                }`}
                        />
                        {/* Status Icon in Input */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {isVerifying && (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            )}
                            {verificationSuccess && (
                                <span className="text-green-500 text-xl">✓</span>
                            )}
                            {error && !isVerifying && (
                                <span className="text-red-500 text-xl">!</span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isVerifying}
                    className={`md:w-32 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 p-4 ${isVerifying
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95"
                        }`}
                >
                    {isVerifying ? "Checking..." : "Save"}
                </button>
            </div>

            {/* Feedback Messages */}
            <div className="h-8 mt-4 flex items-center justify-center md:justify-start overflow-hidden">
                <AnimatePresence mode="wait">
                    {isVerifying && (
                        <motion.div
                            key="verifying"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-medium"
                        >
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Verifying URL reachability...
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm font-medium"
                        >
                            <span className="text-lg">⚠️</span>
                            {error}
                        </motion.div>
                    )}
                    {verificationSuccess && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-lg text-sm font-medium"
                        >
                            <span className="text-lg">✅</span>
                            Verified! Saving bookmark...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
