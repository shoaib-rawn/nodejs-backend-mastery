# Day 9 Homework: Setting up Environment Variables

## The Challenge

Let's secure our app and make it production-ready by extracting hardcoded values into a `.env` file!

### Instructions:

1. **Install Dependencies:**
   - Install `dotenv` (`npm install dotenv`).

2. **Create the `.env` file:**
   - Create a file named exactly `.env` in the root folder of your project (same level as `package.json`).
   - Add two variables:
     ```env
     PORT=5000
     NODE_ENV=development
     ```

3. **Protect the `.env` file:**
   - Open your `.gitignore` file.
   - Add `.env` on a new line at the bottom.

4. **Update `server.ts`:**
   - At the very top of `server.ts`, import dotenv: `import 'dotenv/config';`
   - Update the PORT variable to use the environment variable: `const PORT = process.env.PORT || 5000;`
   - Dynamically configure your Morgan logger. Instead of hardcoding `'dev'`, make it check `process.env.NODE_ENV`:
     ```typescript
     const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
     app.use(morgan(logFormat));
     ```

### Expected Result
When you run `npm run dev`, everything should work exactly as before, but now your configuration is cleanly separated from your code! You can easily change the PORT in `.env` to `8080`, restart the server, and watch it run on the new port.
