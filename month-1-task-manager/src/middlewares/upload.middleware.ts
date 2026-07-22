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
