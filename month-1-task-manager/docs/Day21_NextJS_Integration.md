# Day 21: Introduction to Next.js & API Integration

> [!NOTE]
> 🚀 **Modern Web Development:** Express is excellent for backend services, but to build interactive web apps, we need a frontend. Next.js is a full-stack React framework that gives us layouts, routing, server/client components, and seamless integration with our backend APIs.

---

## 1. What is Next.js?
Next.js is built on top of React. While React is a frontend library for building user interfaces, Next.js is a framework that provides:
1. **App Router:** File-system based router where folders define routes (e.g., `app/page.tsx` maps to `/`).
2. **Layout System:** Nested layouts that preserve state and prevent re-rendering across page transitions.
3. **Optimizations:** Automatic image optimization, font optimization, and fast compilation out of the box.

---

## 2. Server vs. Client Components
In the App Router, components are **Server Components** by default.
* **React Server Components (RSC):** Rendered on the server. They don't have access to browser APIs (like `window`, `useEffect`, or `useState`), but they are super fast and can fetch data securely.
* **Client Components:** Rendered in the browser. You enable them by adding the `"use client";` directive at the very top of the file. They can use hooks (`useState`, `useEffect`) and handle user interactions (clicks, input).

---

## 3. Integrating with the Month 1 Express API
To make our Next.js frontend talk to our Express API (`http://localhost:5000`):
1. **Next.js Dev Server:** Runs on `http://localhost:3000` by default.
2. **API Communication:** We can fetch data from `http://localhost:5000/api/tasks` inside our Next.js client components using `useEffect` and standard `fetch`.
3. **CORS:** We enabled CORS on our Express backend (in Day 20) so the browser allows Next.js (running on port 3000) to fetch data from Express (running on port 5000).

---

## 4. Folder Structure for Full-Stack Integration
```text
month-1-task-manager/
├── src/                    # Backend API (Express + TypeScript)
│   ├── controllers/
│   ├── routes/
│   └── server.ts
├── frontend/               # Next.js SPA Frontend
│   ├── src/
│   │   ├── app/            # App Router pages and CSS
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx  # Root Layout
│   │   │   └── page.tsx    # Dashboard landing page
│   │   └── components/     # Reusable UI elements
│   ├── package.json
│   └── tsconfig.json
```
