# Day 1: APIs, Express, and HTTP Basics

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Today we are covering the yellow boxes for: **"Internet (How does it work?)"**, **"Languages (JavaScript/Node.js)"**, and **"APIs (REST)"**.

## 1. The Client-Server Model
* **Client:** Your browser or mobile app (a customer at a restaurant).
* **Server:** The Backend (the kitchen). 
The Client asks for data, and the Server prepares and sends it back over the internet.

## 2. What is an API?
API stands for **Application Programming Interface**.
Think of it as the specific menu that the Server offers. It tells the Client *exactly* what requests it can make and how to ask for them.

## 3. HTTP Methods
When clients talk to servers, they use "methods" (verbs). The most common are:
* **GET:** "Give me data." (e.g., getting a list of products).
* **POST:** "Here is new data, save it." (e.g., creating a new user account).
* **PUT/PATCH:** "Update existing data."
* **DELETE:** "Remove this data."

## 4. What is Express.js?
Node.js by itself is a bit complex to write web servers with. **Express.js** is a framework that sits on top of Node.js and makes writing routing (like handling GET and POST requests) extremely simple and readable.

## 5. Middleware (Introduction)
In our code: `app.use(express.json());`
This is a **middleware**. It is a function that runs *before* our final route handlers. In this case, it intercepts incoming POST requests and automatically converts any JSON data sent by the client into a format JavaScript can read (`req.body`).

---
### Today's Homework
Write a new GET route for `/api/health` that returns `{"status": "Server is healthy and running!"}`.
