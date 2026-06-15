import { v2 as cloudinary } from 'cloudinary';

// Configure lazily at call-time so env vars are read AFTER dotenv has loaded
// (ES module imports are hoisted and run before dotenv.config() in dev).
function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  configure();
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error || !result) reject(error ?? new Error('Upload failed'));
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}
