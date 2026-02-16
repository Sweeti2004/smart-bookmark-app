# Smart Bookmark App

## Overview
Smart Bookmark App is a modern, responsive bookmark manager built with Next.js and Supabase. It allows users to save, organize, and manage their favorite links in a secure and private environment. The application features a clean, premium UI with smooth animations and real-time updates.

## Live Demo
[Live Vercel URL](https://bookmarkiq.vercel.app)

## Features
-   **Google Authentication**: Secure sign-up and login using Google OAuth via Supabase.
-   **Private Bookmarks**: Each user's bookmarks are private and protected by Row Level Security (RLS) policies.
-   **Real-time Updates**: Changes to bookmarks (additions, deletions) are reflected instantly across all open tabs and devices without refreshing the page.
-   **Responsive Design**: A fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.
-   **Modern UI/UX**: Enhanced with glassmorphism effects, smooth transitions using Framer Motion, and a polished color palette.
-   **Clipboard Integration**: One-click copy functionality for saved URLs.

## Tech Stack
-   **Frontend Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS 4
-   **Backend & Database**: Supabase (PostgreSQL)
-   **Authentication**: Supabase Auth (Google OAuth)
-   **Animations**: Framer Motion
-   **Icons**: React Hot Toast (for notifications)

## Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm or yarn
-   A Supabase project with a `bookmarks` table and Google Auth enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sweeti2004/smart-bookmark-app.git
    cd smart-bookmark-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema
The application uses a single table `bookmarks` in Supabase:
-   `id` (uuid, primary key)
-   `user_id` (uuid, foreign key to `auth.users`)
-   `title` (text)
-   `url` (text)
-   `created_at` (timestamp with time zone)

Row Level Security (RLS) policies are enabled to ensure users can only Select, Insert, Update, and Delete their own rows.

## Challenges & Solutions

### 1. Real-time Subscription RLS Conflicts
**Challenge:** While setting up real-time updates, I initially encountered an issue where updates for one user were being broadcast to all connected clients, regardless of ownership. This was a critical privacy flaw.

**Solution:** I resolved this by enforcing Row Level Security (RLS) on the `realtime` publication in Supabase. I configured the client subscription to listen specifically to the `public` schema with a `filter` on the `user_id` column (`filter: 'user_id=eq.' + user.id`). This ensures that even the WebSocket events are strictly scoped to the authenticated user.

### 2. Preventing Duplicate Bookmarks on Multi-Tab Sync
**Challenge:** When a user adds a bookmark in Tab A, the local state updates immediately. However, the real-time subscription also receives an `INSERT` event, which could potentially cause the same bookmark to appear twice in the list before the next fetch cycle.

**Solution:** I implemented a strict state management strategy where the application relies primarily on the real-time subscription as the "source of truth" for new additions, rather than optimistically updating the UI for the adder. While this introduces a tiny latency (milliseconds), it guarantees absolute consistency across all tabs without complex de-duplication logic.

### 3. Handling Next.js Hydration Mismatches
**Challenge:** Rendering timestamps (like "Created at...") on the server often leads to hydration errors because the server time differs slightly from the client's initial render time, or the user's local timezone isn't known during SSR.

**Solution:** I used a client-side formatting approach. The raw timestamp is passed to the component, but the date string is only generated after the component has mounted on the client. This ensures the HTML matches exactly what React expects, preventing hydration warnings.

### 4. Ensuring URL Reliability
**Challenge:** The hardest part was ensuring that every bookmark saved is actually a working link. Initially, users could input anything, attempting to save broken or fake URLs which cluttered the app.

**Solution:** To fix this, I built a **two-step verification system**:
1.  **Frontend Check:** As the user types, the app instantly validates that the text is formatted like a proper URL (e.g., includes a domain).
2.  **Backend "Ping":** Before saving, my server actually sends a quick request to that website to confirm it's live and reachable. If the site doesn't verify or load, the app blocks the bookmark.
This ensures the database only ever contains valid, active bookmarks.

## Author
**Sweeti Kumari** - *Built for Abstrabit Application Assessment*
