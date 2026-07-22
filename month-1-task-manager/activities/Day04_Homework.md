# Day 4 Homework: Pushing Your Project to GitHub

## The Goal
Initialize Git in your Task Manager project, make your first commit, and push the entire project to a new repository on your GitHub account.

## Instructions
1. **Initialize Git**
   Open your terminal in VS Code (ensure you are inside the `month-1-task-manager` folder) and run:
   `git init`

2. **Stage and Commit your Code**
   Check what files are ready to be tracked:
   `git status`
   
   Add all your files to the staging area:
   `git add .`
   
   Save your first commit:
   `git commit -m "Initial commit for Task Manager API"`

3. **Create a GitHub Repository**
   Go to [GitHub.com](https://github.com/), log in, and create a new repository. 
   Name it `task-manager-api`. 
   **Important:** Do **not** check the boxes to add a README, .gitignore, or license. Keep the repository completely empty!

4. **Push to GitHub**
   GitHub will show you instructions for an "existing repository from the command line". Copy those commands and run them in your terminal. They will look exactly like this:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/task-manager-api.git
   git push -u origin main
   ```

## Expected Result
When you refresh your GitHub repository page in the browser, you should see all your code (`server.ts`, `package.json`, etc.) hosted online securely!

**Once you have successfully pushed your code, reply here with the link to your GitHub repository so we can check it off!**
