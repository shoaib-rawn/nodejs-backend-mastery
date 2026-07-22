# 🐙 Git Practice & Cheat Sheet

This document serves as a living record of Git scenarios, commands, and best practices learned throughout the daily backend development journey.

---

## 1. Branch is "Behind" Main (Syncing Branches)

**The Scenario:**
You check your branch status or GitHub, and it says `dev is 1 commit behind main`.

**Why it happens:**
When you merge a Pull Request, GitHub often creates a new "Merge Commit" on the `main` branch. Because that commit was created on `main`, your local `dev` branch doesn't have it yet. It can also happen if an emergency hotfix is pushed directly to `main`.

**The Best Practice Solution (Back-merging):**
You must sync `main` back into your `dev` branch to ensure your development environment is fully up-to-date with production.

```bash
# 1. Switch to the main branch
git checkout main

# 2. Pull the latest changes from GitHub
git pull origin main

# 3. Switch back to your development branch
git checkout dev

# 4. Merge the updated main into dev
git merge main

# 5. Push the synced dev branch back to GitHub
git push origin dev
```
*Note: This works the exact same way whether you are 1 commit behind or 100 commits behind. Git will automatically apply all missing commits.*

---

## 2. Merge Conflicts and Markers

**The Scenario:**
You attempt to run `git merge` or `git pull`, but Git stops and says: `Automatic merge failed; fix conflicts and then commit the result.`

**Why it happens:**
Being "behind" on commits does *not* cause conflicts. A conflict **ONLY** happens when:
1. You modified a specific line of code on your current branch.
2. Someone else (or you, on another branch) modified that **exact same line** of code.

Because the same line was changed differently in two places, Git does not know which version to keep. It pauses the merge and asks for your human input.

**How to resolve it:**
Git will insert conflict markers into the file where the collision happened:

```text
<<<<<<< HEAD (Current Branch)
PORT=8080
=======
PORT=3000
>>>>>>> main (Incoming Branch)
```

**The Fix:**
1. Open the file in your code editor (VS Code will usually highlight these blocks in green and blue).
2. Decide which code is correct (or combine them if necessary).
3. Delete the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Save the file.
5. Tell Git you fixed it by running:
   ```bash
   git add <filename>
   git commit -m "fix: resolve merge conflicts"
   ```

---

## 3. Untangling Commits (Splitting Work into Separate Branches)

**The Scenario:**
You got into the zone and accidentally completed **two completely different features** (e.g., Day 11 and Day 12) back-to-back. You ran `git add .` and `git commit`, which bundled *both* features into one giant commit on a single branch. Now, you realize you made a mistake because you wanted them cleanly separated on two different feature branches.

**Why it happens:**
Git simply tracks the files you tell it to track. If you do work for multiple features without committing in between, Git will assume they belong together in the same "box" (commit).

**How to resolve it (The Soft Reset):**
You can use a "soft reset" to basically *un-commit* your work without actually deleting any of your code!

```bash
# 1. Un-do the last commit. 
# (This destroys the commit history but leaves all your modified files sitting safely in your code editor).
git reset HEAD~1

# 2. Create and switch to the first feature branch
git checkout -b feature/first-feature

# 3. Carefully add ONLY the files related to the first feature
git add file1.md file2.ts
git commit -m "feat: complete first feature"

# 4. Create and switch to the second feature branch
git checkout -b feature/second-feature
# 🐙 Git Practice & Cheat Sheet

This document serves as a living record of Git scenarios, commands, and best practices learned throughout the daily backend development journey.

---

## 1. Branch is "Behind" Main (Syncing Branches)

**The Scenario:**
You check your branch status or GitHub, and it says `dev is 1 commit behind main`.

**Why it happens:**
When you merge a Pull Request, GitHub often creates a new "Merge Commit" on the `main` branch. Because that commit was created on `main`, your local `dev` branch doesn't have it yet. It can also happen if an emergency hotfix is pushed directly to `main`.

**The Best Practice Solution (Back-merging):**
You must sync `main` back into your `dev` branch to ensure your development environment is fully up-to-date with production.

```bash
# 1. Switch to the main branch
git checkout main

# 2. Pull the latest changes from GitHub
git pull origin main

# 3. Switch back to your development branch
git checkout dev

# 4. Merge the updated main into dev
git merge main

# 5. Push the synced dev branch back to GitHub
git push origin dev
```
*Note: This works the exact same way whether you are 1 commit behind or 100 commits behind. Git will automatically apply all missing commits.*

---

## 2. Merge Conflicts and Markers

**The Scenario:**
You attempt to run `git merge` or `git pull`, but Git stops and says: `Automatic merge failed; fix conflicts and then commit the result.`

**Why it happens:**
Being "behind" on commits does *not* cause conflicts. A conflict **ONLY** happens when:
1. You modified a specific line of code on your current branch.
2. Someone else (or you, on another branch) modified that **exact same line** of code.

Because the same line was changed differently in two places, Git does not know which version to keep. It pauses the merge and asks for your human input.

**How to resolve it:**
Git will insert conflict markers into the file where the collision happened:

```text
<<<<<<< HEAD (Current Branch)
PORT=8080
=======
PORT=3000
>>>>>>> main (Incoming Branch)
```

**The Fix:**
1. Open the file in your code editor (VS Code will usually highlight these blocks in green and blue).
2. Decide which code is correct (or combine them if necessary).
3. Delete the marker lines (`<<<<<<<`, `=======`, `>>>>>>>`).
4. Save the file.
5. Tell Git you fixed it by running:
   ```bash
   git add <filename>
   git commit -m "fix: resolve merge conflicts"
   ```

---

## 3. Untangling Commits (Splitting Work into Separate Branches)

**The Scenario:**
You got into the zone and accidentally completed **two completely different features** (e.g., Day 11 and Day 12) back-to-back. You ran `git add .` and `git commit`, which bundled *both* features into one giant commit on a single branch. Now, you realize you made a mistake because you wanted them cleanly separated on two different feature branches.

**Why it happens:**
Git simply tracks the files you tell it to track. If you do work for multiple features without committing in between, Git will assume they belong together in the same "box" (commit).

**How to resolve it (The Soft Reset):**
You can use a "soft reset" to basically *un-commit* your work without actually deleting any of your code!

```bash
# 1. Un-do the last commit. 
# (This destroys the commit history but leaves all your modified files sitting safely in your code editor).
git reset HEAD~1

# 2. Create and switch to the first feature branch
git checkout -b feature/first-feature

# 3. Carefully add ONLY the files related to the first feature
git add file1.md file2.ts
git commit -m "feat: complete first feature"

# 4. Create and switch to the second feature branch
git checkout -b feature/second-feature

# 5. Add the remaining files for the second feature
git add file3.json file4.ts
git commit -m "feat: complete second feature"
```

**The Result:**
Your code was never lost or deleted! You simply took all the files out of the single combined box, and cleanly separated them into two distinct boxes (branches).

---

## 4. The "No Upstream Branch" Error

**The Scenario:**
You try to push a brand new branch to GitHub by running `git push`, but Git stops and says:
```bash
fatal: The current branch feature/zod-validation has no upstream branch.
```

**Why it happens:**
You created a new branch locally on your computer, but GitHub (the `origin` remote) doesn't know this branch exists yet. Git is confused because it doesn't know *where* on GitHub to push your code.

**The Solution:**
You need to tell Git to push your code AND create the branch on GitHub at the exact same time. You do this by setting the "upstream" link.

Run this command:
```bash
git push --set-upstream origin <your-branch-name>
```

*Shortcut:* You can use `-u` instead of `--set-upstream`.
```bash
git push -u origin <your-branch-name>
```

Once you do this the first time, Git remembers the link! For all future pushes on this branch, you only ever have to type:
```bash
git push
```

---

## 5. Professional Git Flow (`main` vs `dev`)

**The Scenario:**
You are working on a new feature branch every day (`feature/pagination`, `feature/sorting`) and opening Pull Requests (PRs). You are wondering if you should merge these daily PRs directly into the `main` branch.

**Trunk-Based Development (Solo Projects):**
Merging daily feature branches straight into `main` is completely fine for solo side projects! Many indie developers use this because it is fast.

**Professional Git Flow (Real Companies):**
In a professional environment, merging daily work into `main` is dangerous. If a bug sneaks in, the website breaks for actual customers. Instead, companies use this flow:

1. **`main` (Production):** This is the live code for real users. You almost *never* merge daily work here.
2. **`dev` (Staging/Testing):** This is the safe zone. All backend engineers merge their daily feature branches here. QA (Quality Assurance) testers test the API here to ensure nothing is broken.
3. **`feature/*`:** Your daily working branches.

**The Workflow:**
1. **Daily:** Branch off `dev` ➔ `feature/pagination` ➔ Push to GitHub ➔ PR into `dev` (NOT `main`).
2. **End of Sprint/Week (Release Day):** Once `dev` has all the new features (Pagination, Sorting, Validation) and is thoroughly tested, you open ONE massive Pull Request: **`dev` ➔ `main`**. This pushes everything to production at once safely.

---

## 6. Amending Commits (Cleaning up mistakes)

**The Scenario:**
You just made a commit (e.g., `git commit -m "feat: add rate limiter"`). Ten seconds later, you realize you forgot to add a file, or you need to refactor a messy piece of code. You don't want to make a second commit called "Oops, fixed rate limiter" because it makes the Git history look unprofessional.

**The Solution:**
You can merge your new changes directly into the *previous* commit so it looks like you got it perfect the first time.

```bash
# 1. Add your forgotten or refactored files
git add server.ts src/middlewares/rateLimiter.middleware.ts

# 2. Amend the previous commit (the --no-edit flag keeps the original commit message)
git commit --amend --no-edit

# 3. If you already pushed the old commit to GitHub, you MUST force push to overwrite it
git push --force origin feature/rate-limiting
```
*Warning: Never use `--force` on the `main` or `dev` branches if you are working with a team, as it deletes history. Only use it on your personal feature branches!*

---

## 7. GitHub Branch Protection (Protecting `main`)

**The Scenario:**
You see a yellow warning on GitHub saying your `main` branch is not protected.

**Why it happens:**
The `main` branch contains your live production code. If an engineer accidentally runs `git push --force origin main` or `git branch -D main`, the entire history of the project is instantly wiped out.

**The Solution:**
You must put a "lock" on the `main` branch in GitHub settings. 

1. Go to **Settings > Branches** on GitHub.
2. Click **Add branch protection rule** and type `main`.
3. Check the box for **"Require a pull request before merging"**.
4. Check the box for **"Do not allow bypassing the above settings"**.

Once saved, nobody (not even the owner) can push code directly from the terminal to `main`, and nobody can force push or delete it. All changes MUST go through a Pull Request.
