# 📘 Day 13 Code Notes: Production Cloud Image Uploads (Cloudinary SDK & Multer)

> **Topic:** Day 13 - Cloudinary Cloud Storage Integration & Multer Memory Storage Middleware  
> **Source Files:** `src/middlewares/upload.middleware.ts`, `src/utils/cloudinary.utils.ts`, `src/controllers/product.controller.ts`, `src/routes/store.routes.ts`, `activities/verify-day13.ts`

---

## 🎯 Key Concepts Covered

1. **Multer Memory Storage (`multer.memoryStorage()`):**
   * Buffers incoming `multipart/form-data` file streams directly in Node.js RAM as `Buffer` objects (`req.files`).
   * Eliminates disk write/read I/O overhead and avoids managing temporary local files on the server filesystem.

2. **Cloudinary Stream Upload (`upload_stream`):**
   * Uses Node.js Streams to pipe memory buffers directly to Cloudinary cloud infrastructure.
   * Returns a secure HTTPS URL (`secure_url`) and asset identifier (`public_id`) stored in PostgreSQL.

3. **Validation & File Limits:**
   * **MIME Filter:** Restricts uploads to valid image types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`).
   * **Payload Limits:** Maximum 5MB file size per image, maximum 5 files per payload.

4. **Multi-Tenant Media Organization:**
   * Folders are organized per store tenant: `multi-merchant-saas/store-{storeId}/products`.

---

## 💻 Source Code Snippets & Commentary

### 1. Multer Memory Storage Middleware (`src/middlewares/upload.middleware.ts`)
```typescript
import multer from 'multer';
import { Request } from 'express';

// Buffers files in Node.js RAM before uploading to Cloudinary
const storage = multer.memoryStorage();

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
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});
```

### 2. Cloudinary Upload Stream Helper (`src/utils/cloudinary.utils.ts`)
```typescript
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'multi-merchant-saas/products'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed.'));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}
```

### 3. Product Controller Upload Handler (`src/controllers/product.controller.ts`)
```typescript
export async function uploadProductImages(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[];
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, `multi-merchant-saas/store-${storeId}/products`)
  );
  const uploadResults = await Promise.all(uploadPromises);
  const newUrls = uploadResults.map((r) => r.secure_url);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { images: [...product.images, ...newUrls] },
  });

  return res.status(200).json({ status: 'success', uploadedImages: newUrls, product: updatedProduct });
}
```

---

## 🧪 Automated Verification Script Output
```bash
npx ts-node activities/verify-day13.ts
```
```text
🚀 Starting Day 13 Automated Verification Script (Cloudinary & Multer)...
📦 Step 1: Setting up mock Seller User, Store, and Product in PostgreSQL...
🖼️ Step 2: Testing Cloudinary Buffer Upload Stream Utility...
   - Cloudinary Secure URL Generated: https://res.cloudinary.com/...
   ✅ Cloudinary Upload Stream Utility PASSED!
💾 Step 3: Attaching Cloudinary Image URL to Product in Database...
   ✅ PostgreSQL Product Images Array Update PASSED!
🗑️ Step 4: Testing Product Image Deletion Controller Action...
   - Delete Controller Status Code: 200
   ✅ Image Deletion Controller Action PASSED!
🧹 Step 5: Testing Cloudinary Asset Deletion Utility...
   ✅ Cloudinary Asset Deletion Utility PASSED!
🧼 Step 6: Cleaning up verification database entities...

🎉 ALL DAY 13 CLOUDINARY & MULTER VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉
```
