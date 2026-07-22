# Day 12: Data Persistence with the File System (Mock Database)

## The Problem with In-Memory Arrays
Currently, our tasks are stored in a simple array: `let tasks: Task[] = []`. 
This creates a massive problem: **Every time you restart the Express server, all your data is wiped out!** The array lives in your computer's RAM, which is volatile memory.

To build a real application, data must be **persistent** (saved permanently). In Month 2, we will use real databases like MongoDB or PostgreSQL, but today, we will build a "Mock Database" by saving our data directly to a `.json` text file on our hard drive!

---

## 1. The Node.js `fs` Module
Node.js comes with a built-in module called `fs` (File System) that allows your JavaScript code to interact with your computer's hard drive (reading files, writing files, deleting folders).

### Sync vs Async (Blocking vs Non-Blocking)
The `fs` module provides two ways to read a file:
1. `fs.readFileSync`: This stops your entire server until the file is completely read. If you have 10,000 users trying to access your API, they all have to wait. **(Bad for web servers!)**
2. `fs.promises.readFile`: This uses asynchronous Promises. Your server can continue handling other requests while waiting for the file to load in the background. **(Good for web servers!)**

---

## 2. Using `fs/promises`
To use the asynchronous file system methods, we import it like this:
```typescript
import fs from 'fs/promises';
import path from 'path'; // Used to construct file paths safely
```

### Reading a File
When we read a `.json` file, `fs` returns raw text (a string). We must convert it into a JavaScript object using `JSON.parse()`.

```typescript
const filePath = path.join(__dirname, '../data/tasks.json');

const readTasks = async () => {
    // 1. Read the raw text from the file
    const data = await fs.readFile(filePath, 'utf-8');
    // 2. Convert text to JavaScript array
    return JSON.parse(data);
};
```

### Writing to a File
When we save data, we must convert our JavaScript array back into a text string using `JSON.stringify()`.

```typescript
const writeTasks = async (tasksArray) => {
    // Convert array to text (the 'null, 2' argument makes it nicely formatted)
    const jsonText = JSON.stringify(tasksArray, null, 2);
    // Write the text to the file
    await fs.writeFile(filePath, jsonText, 'utf-8');
};
```

By reading and writing to this text file during our CRUD operations, our tasks will survive server restarts!
