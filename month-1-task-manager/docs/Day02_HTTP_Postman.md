# Day 2: HTTP Protocols, Status Codes, and Postman

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Today we are covering the yellow boxes for: **"Internet (HTTP)"**, **"APIs (JSON & REST)"**, and introducing **Postman**.

## 1. The HTTP Protocol
HTTP (Hypertext Transfer Protocol) is the language the internet speaks. When your browser wants to see a website, it sends an "HTTP Request". When our backend replies, it sends an "HTTP Response".

An HTTP message consists of two main parts:
* **Headers:** Hidden metadata (like telling the browser "Expect JSON data!" or "This data is 50kb large").
* **Body:** The actual data (like the JSON product list you send back).

## 2. HTTP Status Codes
When the server responds, it must include a 3-digit number called a **Status Code** so the client immediately knows if it was successful or an error.

* **200s (Success):** Everything went great!
  * `200 OK`: Standard success (default in Express).
  * `201 Created`: Success! A new item was successfully saved to the database.
* **400s (Client Error):** The client messed up.
  * `400 Bad Request`: The client sent bad data (e.g., trying to save a task without a title).
  * `401 Unauthorized`: The client needs to log in first.
  * `404 Not Found`: The URL does not exist.
* **500s (Server Error):** The backend crashed.
  * `500 Internal Server Error`: Our Node.js code broke.

## 3. Postman
A web browser is a terrible tool for testing backends because a browser can only easily send `GET` requests (just by typing a URL). 

When we build a Task Manager, we need to send `POST` (create task), `PUT` (update task), and `DELETE` (delete task). To do this, we use **Postman**. It is a developer tool that lets you build and send any type of HTTP request to your backend.
