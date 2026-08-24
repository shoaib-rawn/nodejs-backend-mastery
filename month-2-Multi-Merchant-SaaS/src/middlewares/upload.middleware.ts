import multer from 'multer';
import { Request } from 'express';

// Memory Storage: Files are buffered in memory as Node.js Buffers before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter: Only image MIME types allowed
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, and GIF images are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per image
    files: 5, // Maximum 5 files per upload payload
  },
});
