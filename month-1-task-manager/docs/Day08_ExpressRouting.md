# Day 8: Express Routing In-Depth (Params & Queries)

## The Core Concept

In robust APIs, you rarely just fetch *all* data. Clients usually want specific data—like fetching a single user profile, or getting a list of tasks that are specifically marked as "completed".

Express handles dynamic URL data using two primary properties on the Request object:
1. **`req.params`** (Route Parameters)
2. **`req.query`** (Query Strings)

---

## 1. Route Parameters (`req.params`)

Route parameters are named URL segments used to capture values at specific positions in the URL. 
They are almost always used to **identify a specific resource** (like a single Task, User, or Post).

### How it works
You define a route parameter by prefixing a segment in your route path with a colon (`:`).

```typescript
// The route path is defined with a parameter named 'id'
router.get('/:id', (req: Request, res: Response) => {
    
    // If the user visits /api/tasks/123
    const taskId = req.params.id; // taskId will equal "123"
    
    res.json({ message: `Fetching task with ID: ${taskId}` });
});
```

*Note: The value extracted from `req.params` is always a string. If your IDs are numbers, you will need to parse them using `parseInt()` or `Number()`.*

---

## 2. Query Strings (`req.query`)

Query strings are a set of key-value pairs appended to the end of a URL after a question mark (`?`). Multiple pairs are separated by an ampersand (`&`).
They are primarily used for **filtering, sorting, searching, or paginating** a list of resources.

### How it works
You **do not** need to define query strings in your route path. Express automatically parses everything after the `?` and places it inside the `req.query` object.

```typescript
// The route path is just the standard endpoint
router.get('/', (req: Request, res: Response) => {
    
    // If the user visits /api/tasks?completed=true&limit=5
    
    const isCompleted = req.query.completed; // "true"
    const limit = req.query.limit;           // "5"
    
    res.json({ 
        message: "Fetching tasks...",
        filtersApplied: { isCompleted, limit }
    });
});
```

---

## Key Differences & Best Practices

| Feature | Syntax Example | Use Case |
| :--- | :--- | :--- |
| **Params** | `/api/tasks/123` | **Identification:** Getting, updating, or deleting a *specific* item. |
| **Queries** | `/api/tasks?completed=true` | **Filtering:** Narrowing down a large list, sorting, or paginating. |

### Routing Order Matters!
Express matches routes from top to bottom. If you have a static route (like `/recent`) and a dynamic route (like `/:id`), you **must** place the static route first. 

```typescript
// ✅ CORRECT ORDER
router.get('/recent', getRecentTasks); // Checked first
router.get('/:id', getTaskById);       // Checked second

// ❌ INCORRECT ORDER
router.get('/:id', getTaskById);       // If this is first, a request to /recent will be treated as an ID!
router.get('/recent', getRecentTasks); // This will never run.
```
