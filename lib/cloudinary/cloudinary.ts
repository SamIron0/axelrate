// lib/cloudinary.ts

import cloudinary from "cloudinary"

// Initialize Cloudinary with your credentials (usually from environment variables)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Function to upload an image to Cloudinary
export const uploadImage = async (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file.path, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result.secure_url)
      }
    })
  })
}

export default cloudinary
