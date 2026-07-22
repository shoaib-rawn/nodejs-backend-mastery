# Day 20: Homework & Activities

Today is the final day of the Month 1 Task Manager project! Our goal is to clean up our codebase and prepare it for the final merge into the `main` branch.

## Task 1: Remove Dead Code
Yesterday, we added a temporary test route to see our error stack traces. We cannot leave this in our production code!
1. Open `src/routes/task.routes.ts`.
2. Locate the `router.get('/error/test')` block at the very bottom.
3. Delete it completely!

## Task 2: Code Review & Polish
1. Quickly browse through your `controllers`, `routes`, `middlewares`, and `utils` folders.
2. Check if there are any unused imports at the top of your files (they usually appear faded or grayed out in VS Code). Delete them if you find any.
3. Ensure every file has a consistent empty line at the very end of the file.

## Task 3: The Grand Finale (Merging into Main)
Once your code is perfectly clean:
1. Commit your cleanup changes: `git commit -am "chore: final code cleanup and remove test routes"`
2. Push your `feature/code-cleanup` branch to GitHub.
3. Switch to your main branch: `git checkout main`
4. Pull the latest from GitHub just in case: `git pull origin main`
5. **Merge the Dev Branch:** (Wait for instructions from your AI on the safest way to merge!)
