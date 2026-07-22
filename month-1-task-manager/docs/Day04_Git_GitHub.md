# Day 4: Terminal Usage, Git Basics, and GitHub

## 1. The Terminal
The terminal (or command prompt/PowerShell) is how developers interact with their computers without using a mouse. 

**Important Basic Commands:**
- `dir` or `ls`: Lists all files and folders in your current directory.
- `cd <folder_name>`: Changes your directory (e.g., `cd src` moves you into the src folder).
- `cd ..`: Moves you back up one folder.
- `mkdir <folder_name>`: Creates a new directory.

## 2. Version Control with Git
Git is a tool that tracks changes to your code over time. It's like a time machine or a save point in a video game. If you break something, you can always go back to a working version.

**The Basic Git Workflow:**
1. `git init`: Initializes a brand new Git repository in your folder. *(You only do this once per project).*
2. `git status`: Shows which files have been modified, added, or deleted.
3. `git add .`: Stages all your changes, getting them ready to be saved.
4. `git commit -m "your message"`: Saves the staged changes permanently in your local time machine. The message should describe what you did (e.g., `"Added centralized error handler"`).

## 3. GitHub
While Git lives locally on your computer, **GitHub** is a website that hosts your Git repositories online in the cloud. This allows you to back up your code, share it on your resume, and collaborate with others.

**How to connect your local code to GitHub:**
1. Create a new, completely empty repository on the GitHub website.
2. Copy the URL of the new repository.
3. In your terminal, link your local project to GitHub by running:
   `git remote add origin <your_github_repo_url>`
4. Push your code to the internet by running:
   `git push -u origin main` (or `master` depending on your Git setup).
