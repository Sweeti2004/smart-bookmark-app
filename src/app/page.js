"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchBookmarks(session.user.id);
      }
    );

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          if (user) {
            fetchBookmarks(user.id);
          }
        }
      )
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user]);


  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user ?? null;
    setUser(sessionUser);
    if (sessionUser) fetchBookmarks(sessionUser.id);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
  };

  const fetchBookmarks = async (userId) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setBookmarks(data);
  };

  const addBookmark = async () => {
    if (!title || !url) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setUrl("");
      fetchBookmarks(user.id);
    }
  };

  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!user ? (
        <div className="flex items-center justify-center h-screen">
          <button
            onClick={signInWithGoogle}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <p className="font-semibold">{user.email}</p>
            <button
              onClick={signOut}
              className="text-red-500 font-medium"
            >
              Logout
            </button>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <input
              type="text"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Bookmark URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={addBookmark}
              className="bg-black text-white py-2 rounded"
            >
              Add Bookmark
            </button>
          </div>

          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-medium">{bookmark.title}</p>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-blue-500 text-sm"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
