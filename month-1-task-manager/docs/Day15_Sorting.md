# Day 15: Filtering & Sorting

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Today we are continuing our deep dive into advanced API features by learning how to sort our data dynamically based on what the user wants.

## 1. What is Sorting?
If you go to Amazon and search for shoes, you don't just want a random list. You want to sort by "Price: Low to High" or "Newest Arrivals". 

In REST APIs, we control sorting using **Query Parameters**, exactly like we did with Pagination.
Example: `GET /api/tasks?sortBy=createdAt&order=desc`
* `sortBy`: The field we want to sort by (e.g., `title`, `createdAt`).
* `order`: The direction. `asc` (ascending, low-to-high, A-Z) or `desc` (descending, high-to-low, Z-A).

## 2. JavaScript's `.sort()` Method
To sort arrays in JavaScript, we use the built-in `.sort()` method. It compares two items at a time (`a` and `b`).

**Basic Alphabetical Sort (A-Z):**
```javascript
tasks.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
});
```

**Sorting by Date (Newest First / Descending):**
When sorting by time (like `createdAt`), we subtract the dates.
```javascript
tasks.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
});
```

## 3. Order of Operations in the Controller
If a user asks for Filtering, Sorting, AND Pagination all at once (e.g., `?completed=true&sortBy=title&page=1`), the order your backend processes it is **CRITICAL**.

You must always follow this exact order:
1. **Filter** (Remove the tasks they don't want).
2. **Sort** (Organize the remaining tasks).
3. **Paginate** (Slice the organized list).
