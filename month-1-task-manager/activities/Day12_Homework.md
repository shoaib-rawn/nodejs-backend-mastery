# Day 12 Homework: Implement the File System Mock Database

## The Challenge
It's time to make our data persistent! We are going to replace our hard-coded array with a real `.json` file stored on the hard drive.

### Instructions:

1. **Create the Mock Database File:**
   - Inside `src/`, create a new folder called `data/`.
   - Inside `src/data/`, create a file named `tasks.json`.
   - Add an empty array `[]` inside the file to act as your starting database.

2. **Update the Controller (`src/controllers/task.controller.ts`):**
   - Delete the `let tasks = [...]` array completely.
   - Import `fs` from `'fs/promises'` and `path` from `'path'`.
   - Define the file path using `path.resolve` (or `path.join`).
   - *Hint:* Since we run our code from the project root using `npm run dev`, `path.resolve('src/data/tasks.json')` is the safest way to target the file.

3. **Refactor CRUD Operations to use `async/await`:**
   Because reading from the hard drive takes time, all your controllers must become `async` functions!
   - `getAllTasks`: Read the file, `JSON.parse` it, and return the data.
   - `createTask`: Read the file, parse it, `.push()` the new task, `JSON.stringify` the array, write it back to the file, and return the new task.
   - Do the same for `updateTask` and `deleteTask`.

### Testing
Use Postman to create a new task. Then, **kill your server** in the terminal (`Ctrl+C`) and restart it. Use Postman to `GET /api/tasks`. If your task is still there, you have successfully built a persistent database!
