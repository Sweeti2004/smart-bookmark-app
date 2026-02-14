"use client";

import { motion } from "framer-motion";

export default function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 rounded-full animate-pulse-slow">
                <span className="text-6xl filter drop-shadow-md">📂</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your library is empty
            </h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
                Start building your collection by adding your first bookmark above. ✨
            </p>
        </motion.div>
    );
}
