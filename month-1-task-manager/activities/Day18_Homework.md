# Day 18: Homework & Activities

Today's goal is to clean up `task.controller.ts` by extracting the file system logic into a dedicated Utility file!

## Task 1: Create the Utils Folder
1. Inside the `src` directory, create a new folder called `utils`.
2. Inside `utils`, create a new file called `file.utils.ts`.

## Task 2: Move the Logic
1. Open `src/controllers/task.controller.ts`.
2. Cut the `readTasks` and `writeTasks` functions (along with the `Task` interface and the `fs`/`path` imports) and paste them into `src/utils/file.utils.ts`.
3. Make sure you add the `export` keyword before `readTasks` and `writeTasks` so they can be used outside of the file!

## Task 3: Re-import into the Controller
1. Go back to `src/controllers/task.controller.ts`.
2. You will see a bunch of red errors because `readTasks` is missing.
3. Import `readTasks`, `writeTasks`, and the `Task` interface at the top of the file from `../utils/file.utils.js`.

## Task 4: Test it!
1. Run `npm run dev`.
2. Open Postman and make a GET request to `/api/tasks`. If it still returns your tasks, your refactoring was a massive success! Your code does the exact same thing as before, but the architecture is now much more professional.
