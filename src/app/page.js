"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import EmptyState from "@/components/EmptyState";
import BookmarkCard from "@/components/BookmarkCard";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import { useCallback } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        fetchBookmarks(sessionUser.id);
      }
      setLoading(false);
    };

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          fetchBookmarks(currentUser.id);
        } else {
          setBookmarks([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
    toast.success("Logged out successfully");
  };

  const fetchBookmarks = async (userId) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data);
  };

  const addBookmark = useCallback(async (title, url, onSuccess) => {
    if (!title || !url) {
      toast.error("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id },
    ]);

    if (!error) {
      if (onSuccess) onSuccess();
      fetchBookmarks(user.id);
      toast.success("Bookmark added!");
    } else {
      toast.error("Error adding bookmark");
    }
  }, [user]);

  const deleteBookmark = useCallback(async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
    toast.success("Bookmark deleted");
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
        },
        success: {
          iconTheme: {
            primary: '#6366f1',
            secondary: '#fff',
          },
        },
      }} />

      {/* Navbar */}
      <Navbar user={user} signOut={signOut} />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {!user ? (
          // Login View
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 sm:p-12 text-center border border-white/20 relative overflow-hidden"
          >
            {/* Decorative Background Blob */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 relative z-10">
              BookmarkIQ
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mb-8 text-lg relative z-10">
              Organize your digital life with intelligence and style.
            </p>

            <button
              onClick={signInWithGoogle}
              className="relative z-10 w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold hover:shadow-lg hover:border-indigo-300 dark:hover:border-slate-600 transition-all duration-300 group hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="mt-6 text-xs text-gray-400 relative z-10">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        ) : (
          // Dashboard View
          <div className="w-full max-w-5xl mx-auto space-y-8">

            {/* Add Bookmark Section */}
            <AddBookmarkForm onAdd={addBookmark} />

            {/* Bookmark Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-300">
                  Your Collection
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-full">
                  {bookmarks.length} items
                </span>
              </div>

              {bookmarks.length === 0 ? (
                <EmptyState />
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {bookmarks.map((bookmark) => (
                      <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        deleteBookmark={deleteBookmark}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
