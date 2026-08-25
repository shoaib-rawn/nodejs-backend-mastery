# Day 21: Homework & Activities - Next.js Setup & Fetching

Today, you initialized the Next.js project and connected it to your Express API. Your homework is to implement the first client-side fetch integration.

## Task 1: Understand the Next.js Scaffold
1. Open `frontend/src/app/page.tsx`.
2. Delete the default boilerplate code.
3. Write a simple `"use client";` component that fetches tasks from `http://localhost:5000/api/tasks` when the page mounts, using standard React `useEffect` and `useState`.

## Task 2: Implement a Simple Task List
1. Create a dynamic state `const [tasks, setTasks] = useState([])`.
2. Write a `fetchTasks` function inside a `useEffect` hook.
3. Map over `tasks` and display them in a basic unordered list `<ul>` with the task title and completion status (e.g. `[Completed]` or `[Pending]`).

## Task 3: Test Local Routing
Verify that:
1. Your Express backend server is running on `http://localhost:5000`.
2. Your Next.js development server is running on `http://localhost:3000` (run `npm run dev` inside `/frontend`).
3. You can open `http://localhost:3000` in your browser and see the list of tasks retrieved dynamically from your local `tasks.json` file.
