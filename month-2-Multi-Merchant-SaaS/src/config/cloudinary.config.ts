import { v2 as cloudinary } from 'cloudinary';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud_name',
    api_key: process.env.CLOUDINARY_API_KEY || 'mock_api_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_api_secret',
  });
}

export default cloudinary;
