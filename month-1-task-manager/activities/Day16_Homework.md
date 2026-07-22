# Day 16: Homework & Activities

Today's goal is to allow users to attach an image to a Task using Multer!

## Task 1: Setup and Installation
1. We need to install the multer package and its TypeScript definitions.
2. Open your terminal and run:
   ```bash
   npm install multer
   npm install --save-dev @types/multer
   ```
3. Create a new folder at the root of your project called `uploads`. This is where all the images will be physically saved!

## Task 2: Configure Multer Middleware
1. Create a new file: `src/middlewares/upload.middleware.ts`.
2. Write the multer configuration to specify the destination folder:
```typescript
import multer from 'multer';
import path from 'path';

// Define where to store the files and what to name them
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the uploads folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename so users don't overwrite each other's images
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Export the configured middleware
export const upload = multer({ storage: storage });
```

## Task 3: Attach Middleware to the POST Route
1. Open `src/routes/task.routes.ts`.
2. Import your new `upload` middleware.
3. Add it to your `POST /` route **before** your controller, telling it to look for a field named `image`:
   * `router.post('/', upload.single('image'), validate(createTaskSchema), createTask);`

## Task 4: Update the Controller & DB
1. In your `Task` interface (`src/controllers/task.controller.ts`), add `imageUrl?: string`.
2. Inside `createTask`, check if `req.file` exists. If it does, save its filename to the new task object:
   * `const imageUrl = req.file ? '/uploads/' + req.file.filename : undefined;`
3. Test it using Postman! (You will need to use the **Form-Data** tab in Postman instead of the Raw JSON tab to upload a file).
