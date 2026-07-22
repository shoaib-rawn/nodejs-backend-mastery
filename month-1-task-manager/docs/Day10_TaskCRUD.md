# Day 10: Building the Core CRUD Structure

## What is CRUD?
CRUD is an acronym that represents the four basic operations of persistent storage in a REST API:
* **C**reate (`POST`)
* **R**ead (`GET`)
* **U**pdate (`PUT` or `PATCH`)
* **D**elete (`DELETE`)

So far, we have built the **Read** operations (`GET /api/tasks` and `GET /api/tasks/:id`). To make our Task Manager API fully functional, we need to allow users to add new tasks, update their completion status or title, and delete them.

---

## 1. Create (POST)
To create a new resource, the client sends a `POST` request. The data for the new resource is sent in the **request body** (`req.body`).

*Note: For Express to understand JSON request bodies, we must have `app.use(express.json())` configured in `server.ts` (which we already did on Day 1).*

**Example Controller:**
```typescript
export const createTask = (req: Request, res: Response) => {
    // 1. Extract data from the body
    const { title } = req.body;
    
    // 2. Create the new object
    const newTask = {
        id: Date.now().toString(), // Generate a fake ID
        title,
        completed: false
    };
    
    // 3. Save it to our array
    tasks.push(newTask);
    
    // 4. Return the new object with a 201 Created status
    res.status(201).json(newTask);
};
```

---

## 2. Update (PUT)
To update a resource, the client sends a `PUT` request to a specific ID (e.g., `/api/tasks/123`). The updated data is passed in the **request body**.

**Example Controller:**
```typescript
export const updateTask = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    // Find the task
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }
    
    // Update the task properties
    tasks[taskIndex].title = title !== undefined ? title : tasks[taskIndex].title;
    tasks[taskIndex].completed = completed !== undefined ? completed : tasks[taskIndex].completed;
    
    res.json(tasks[taskIndex]);
};
```

---

## 3. Delete (DELETE)
To delete a resource, the client sends a `DELETE` request to a specific ID. No request body is needed.

**Example Controller:**
```typescript
export const deleteTask = (req: Request, res: Response) => {
    const { id } = req.params;
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }
    
    // Remove it from the array
    tasks.splice(taskIndex, 1);
    
    // Typically return a 204 No Content, or a success message
    res.json({ message: "Task deleted successfully" });
};
```

---

## The RESTful Naming Convention
A proper REST API groups operations under the exact same route path but uses different HTTP methods.

| HTTP Method | Route | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | Get a specific task by ID |
| `PUT` | `/api/tasks/:id` | Update a specific task by ID |
| `DELETE`| `/api/tasks/:id` | Delete a specific task by ID |
