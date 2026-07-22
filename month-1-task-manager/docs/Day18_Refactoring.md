# Day 18: Refactoring & The DRY Principle

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Knowing how to write code that works is only half the job. Today, we learn how to write code that is clean, professional, and easy to maintain.

## 1. The DRY Principle
**DRY** stands for **Don't Repeat Yourself**. 
If you find yourself copying and pasting the exact same block of code in 3 different files, you are violating the DRY principle. Instead, you should extract that code into a single "Helper Function" and just call it from the 3 files. If you ever need to fix a bug, you only have to fix it in one place!

## 2. Separation of Concerns (Revisited)
We previously separated our Routes from our Controllers. But right now, our `task.controller.ts` is still doing too many jobs! 
Currently, the controller is responsible for:
1. Reading the HTTP Request.
2. Checking if files are uploaded.
3. **Talking directly to the Hard Drive (using `fs.readFile` and `fs.writeFile`).**
4. Sending the HTTP Response.

The controller should NOT know how the database works. It should just say *"Hey Database, give me the tasks!"*

## 3. The Utility (Utils) Folder
To fix this, professional projects use a `utils/` or `services/` folder. We take all the "Hard Drive/Database" logic (`readTasks` and `writeTasks`) and move it into a dedicated `file.utils.ts` file. 

By doing this:
* `task.controller.ts` becomes much smaller and easier to read.
* If we ever switch from a JSON file to a real Database (like MongoDB in Month 2), we only have to rewrite the `utils` file, and the controller doesn't have to change at all!
