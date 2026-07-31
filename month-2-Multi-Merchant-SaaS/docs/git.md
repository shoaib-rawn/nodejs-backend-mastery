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

---

## 8. Undo Commits Safely: Soft vs. Hard Reset (`git reset HEAD~`)

**The Scenario:**
You made a commit on your branch, but you immediately realized you made a mistake (e.g. committed to the wrong branch, used the wrong message, or want to review/change the code before committing again). You want to undo that commit.

### A. The Soft Reset (Recommended) 🟢
Undoes the commit but **keeps all your modified code changes intact and already staged** (staged files stay green, ready to be committed again).

```bash
# Undo the very last commit, keeping your files staged
git reset --soft HEAD~1
```
*   **Why use it:** Great when you just want to change the commit message or group multiple files into a single commit without losing any changes.

### B. The Mixed Reset (Default) 🟡
Undoes the commit and **unstages all changes** (files return to your working tree as red, unstaged modifications).

```bash
# Undo the very last commit, unstaging your files (Default)
git reset HEAD~1
```

### C. The Hard Reset (Dangerous!) 🔴
Undoes the commit and **permanently destroys all changes** in your files since that commit. You cannot recover this work!

```bash
# WARNING: This deletes the commit AND all your work!
git reset --hard HEAD~1
```
*   **Why use it:** Only use this when you want to throw away your recent code changes completely and restore the project back to the previous commit status.

---

## 9. Git Stash: Saving Work Temporarily

**The Scenario:**
You are in the middle of implementing a complex feature (e.g. Day 05 Categories & Products) on your branch, but you haven't finished the code yet, so you cannot make a clean commit. Suddenly, your team lead asks you to switch immediately to the `main` branch to debug a critical production bug. When you try to checkout the other branch, Git blocks you, warning that your uncommitted changes would be overwritten.

**Why it happens:**
Git prevents you from switching branches if you have modified files that conflict with the branch you are switching to. This safety feature prevents you from accidentally losing your working draft.

**The Solution (Stashing):**
You can "stash" your changes in a temporary drawer, leaving your working directory completely clean. Once you finish the hotfix on the other branch, you can switch back and pull your changes out of the drawer!

### 1. Save your changes temporarily
Run this command to clear your working directory and save your modifications:
```bash
git stash
```
*Your code editor will instantly revert to the status of your last commit, but your draft changes are saved safely in Git's stack.*

### 2. (Optional) Give your stash a custom name
If you have multiple stashes and want to label them:
```bash
git stash save "Work in progress on Day 05"
```

### 3. Switch branches and complete your bugfix
```bash
git checkout main
# ... fix the bug, commit, and push ...
```

### 4. Switch back and restore your work
Once you return to your feature branch, retrieve your stashed changes:
```bash
git checkout feature/day05-categories-products

# Pull the changes out of the stash stack and apply them
git stash pop
```
*`git stash pop` applies the changes to your working directory and automatically deletes that stash from the Git stack. If you want to keep the stash in the stack while applying it, use `git stash apply` instead.*

### 5. Managing your stashes
*   **List all stashes**: `git stash list`
*   **Clear all stashes**: `git stash clear`
*   **Drop a specific stash**: `git stash drop stash@{0}`

---

## 10. Undoing Pushed Commits Safely: Git Revert

**The Scenario:**
You discover that a commit you made yesterday introduced a critical bug. Unfortunately, you already pushed this commit to GitHub, and other developers have already pulled it. You want to undo that commit, but running `git reset` is forbidden because it deletes history, meaning everyone on your team would face sync conflicts.

**Why it happens:**
`git reset` rewrites Git history by erasing commits. Once a commit is pushed to a shared remote repository, rewriting history is highly discouraged. 

**The Solution (`git revert`):**
Instead of deleting the bad commit, `git revert` creates a **new, follow-up commit** that does the exact opposite of the bad commit (e.g. if the bad commit added a line, the revert commit deletes it). This keeps the history linear and clean without breaking anyone else's local copy.

### 1. Find the hash of the bad commit
Run this to see your commit history in a single line format:
```bash
git log --oneline
```
*Locate the hash of the commit you want to undo (e.g., `a1b2c3d`).*

### 2. Revert the commit
Run the revert command pointing to that hash:
```bash
git revert a1b2c3d
```
*Git will automatically open a text editor asking you to confirm the commit message (e.g., `Revert "feat: add buggy payment flow"`). Save and close the editor.*

### 3. Push the safe revert commit to GitHub
```bash
git push origin <branch-name>
```

**Result**: You have successfully undone the buggy changes safely, and your team's Git histories remain perfectly synchronized!

---

## 11. Untracking Files Already Pushed (git rm --cached)

**The Scenario:**
You accidentally committed and pushed a private folder (like `preparation/` or `.agents/`) or a sensitive file (like `.env`) to GitHub. You added it to your `.gitignore` file, but Git is still tracking it and pushes any modifications to GitHub. You want to stop tracking it on GitHub but keep the physical files on your local machine.

**Why it happens:**
Adding a file to `.gitignore` only works for **untracked** files. If a file was already committed and pushed, Git will continue to track it because it remains in Git's tracking cache. 

**The Solution:**
You must manually tell Git to stop tracking the file/folder in its index cache, without deleting your local copy:

### 1. Add the path to `.gitignore`
Make sure the file or folder is added to `.gitignore` first (e.g. adding `.agents/` or `preparation/`).

### 2. Remove the file/folder from Git tracking cache
Run this command from the repository root:
```bash
# To untrack a folder (use -r for recursive):
git rm -r --cached path/to/folder/

# To untrack a single file:
git rm --cached path/to/file.env
```
*Note: The `--cached` flag is critical. It tells Git to delete the file/folder ONLY from the Git repository index, leaving your physical local files untouched.*

### 3. Commit the change
Stage and commit the untracking changes:
```bash
git add .gitignore
git commit -m "docs: remove private folder from git tracking"
```

### 4. Push to GitHub
```bash
git push origin <branch-name>
```

**Result:** The file or folder is deleted from your GitHub repository online, but it remains safe and active in your local code editor!

---

## 12. Resolving package-lock.json Merge Conflicts Safely

**The Scenario:**
You run `git pull` or merge a branch, and Git warns of a merge conflict in `package-lock.json`. The file contains thousands of lines of code, making it impossible to resolve manually using VS Code conflict markers.

**Why it happens:**
Both branches added or updated different packages, which edited the auto-generated `package-lock.json` file. Since both edited the same files, Git got confused.

**The Solution (Rebuilding the Lock File):**
Do not attempt to fix `package-lock.json` manually! Instead, let `npm` automatically rebuild it:

### 1. Checkout the project's version of the lock file
We discard the conflict markers and reset the file back to your branch's original state:
```bash
git checkout --ours package-lock.json
```

### 2. Run npm install to merge changes automatically
Run a fresh install. `npm` will read the updated `package.json` (which contains the combined list of dependencies from both branches) and automatically rebuild a clean, non-conflicted `package-lock.json`:
```bash
npm install
```

### 3. Commit the resolved lock file
Stage the clean file and finalize the merge:
```bash
git add package-lock.json
git commit -m "chore: resolve package-lock.json merge conflict"
```

---

## 13. Renaming Git Branches Safely (Local & Remote)

**The Scenario:**
You created a branch, wrote some commits, and pushed it to GitHub. Later, you realize you made a typo in the branch name (e.g. typing `feat/day09-jwt` instead of `feature/day09-jwt-rotation`). You want to rename the branch both locally and on GitHub without losing your commits.

**The Solution:**
You can rename your active branch locally, push the new branch, and delete the old name from GitHub:

### 1. Rename your local branch
Switch to the branch you want to rename, then run:
```bash
# Rename the current active branch:
git branch -m <new-branch-name>
```

### 2. Push the new branch and reset upstream
Push the renamed branch to GitHub and link it:
```bash
git push origin -u <new-branch-name>
```

### 3. Delete the old branch from GitHub
Remove the old branch name from the remote repository:
```bash
git push origin --delete <old-branch-name>
```
*Note: Your local commits are fully preserved; you have simply renamed the label pointing to them.*

---

## 14. Integrating Development Updates into your Feature Branch

**The Scenario:**
You are working on a local feature branch `feature/day10-rbac` that you created in the morning. In the afternoon, a teammate merges a database fix into the shared `shoaibs-dev` branch on GitHub. You need to pull their database fix into your active feature branch so you are coding on top of the latest updates.

**The Solution:**
You can fetch the remote branch status and merge the shared development branch into your active branch:

### 1. Fetch the latest metadata from GitHub
Before merging, download the latest branch states from the remote server:
```bash
git fetch origin
```

### 2. Merge the integration branch into your active branch
Make sure you are standing on your feature branch, then run:
```bash
git merge origin/shoaibs-dev
```

### 3. Resolve conflicts (if any)
If you and your teammate edited the same line of code, Git will pause and ask you to select which lines to keep. Open the conflicting files, choose the correct lines, then finalize the merge:
```bash
git add <conflicting-file-path>
git commit -m "merge: integrate origin/shoaibs-dev updates"
```
*Tip: Keep your feature branch updated daily to minimize large conflicts when submitting pull requests.*



