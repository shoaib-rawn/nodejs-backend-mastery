# Day 11: RESTful Principles & JSON Formatting

## 1. What is REST?
**REST** stands for **Representational State Transfer**. It is not a strict protocol or tool, but rather a set of **architectural guidelines** for designing networked applications. When an API follows these rules, we call it a **RESTful API**.

### The Core Principles of REST:
1. **Client-Server Architecture:** The frontend (client) and backend (server) are completely separate. The client handles the UI, and the server handles data and security.
2. **Statelessness:** The server does not remember anything about the client between requests. Every single HTTP request must contain all the information necessary to process it (e.g., authentication tokens).
3. **Uniform Interface:** Resources should have consistent, predictable URIs and use standard HTTP methods. 
   - *Good:* `GET /api/tasks`, `POST /api/tasks`, `DELETE /api/tasks/:id`
   - *Bad:* `GET /api/getAllTasks`, `POST /api/createNewTask`, `GET /api/deleteTask/:id`

---

## 2. Standardizing JSON Responses
Right now, our controllers return JSON in wildly different formats. 

- `getAllTasks` returns: `{ message: string, tasks: array }`
- `getTaskById` returns: `{ id: string, title: string }`
- Errors return: `{ message: string }`

This is a nightmare for frontend developers! A good REST API implements a **standard JSON envelope (wrapper)** so the client always knows exactly how to parse the response.

### The JSend-Inspired Standard
A very popular pattern is to wrap every response in an object containing `success`, `data`, and sometimes a `message`.

**Success Example:**
```json
{
    "success": true,
    "data": {
        "id": "1",
        "title": "Buy groceries",
        "completed": false
    }
}
```

**Error Example:**
```json
{
    "success": false,
    "message": "Task not found"
}
```

### Why do this?
1. **Predictability:** Frontend developers can always check `response.data.success` before trying to read the actual data.
2. **Consistency:** Arrays and single objects are handled exactly the same way.
3. **Scalability:** If we need to add metadata later (like pagination info), we just add it to the wrapper without breaking the `data` structure.
