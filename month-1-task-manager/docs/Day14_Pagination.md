# Day 14: Pagination

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Today we are covering advanced API concepts and learning how to handle massive amounts of data without crashing our server.

## 1. What is Pagination?
Imagine if you searched "shoes" on Amazon, and their backend tried to send you all 10,000,000 shoes in one single JSON response. Your browser would crash, and their database would melt. 

**Pagination** is the solution. It means dividing data into "Pages". Instead of sending 10 million shoes, the server sends exactly 10 shoes (Page 1). If the user clicks "Next Page", the server sends the next 10 shoes (Page 2).

## 2. How Pagination Works in APIs
In REST APIs, we control pagination using **Query Parameters** in the URL. 
Example: `GET /api/tasks?page=2&limit=5`
* `page`: Which page number the user wants.
* `limit`: How many items they want per page.

## 3. The Math Behind Pagination
To make this work in our code (or database), we need to calculate a `startIndex` and an `endIndex` based on what the user asked for.

If `page=2` and `limit=5`:
* **Start Index:** `(page - 1) * limit` ➔ `(2 - 1) * 5` = **Index 5**
* **End Index:** `page * limit` ➔ `2 * 5` = **Index 10**

So we slice our array of tasks from Index 5 to Index 10!

## 4. Default Values
Users won't always provide `page` and `limit` in the URL. As backend engineers, we must always provide **fallback default values** (e.g., if they just visit `/api/tasks`, we assume `page=1` and `limit=10`).
