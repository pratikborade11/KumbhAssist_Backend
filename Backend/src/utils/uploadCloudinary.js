import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// this is using the express-fileupload
const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "Kumbh",
            resource_type: "auto",
        });

        // After successful upload, remove temporary file
        await removeTmp(localFilePath); // Ensure the file is removed asynchronously
        return response;
    } catch (error) {
        console.log("Error while uploading to Cloudinary", error);
        // Ensure the file is removed even if the upload fails
        await removeTmp(localFilePath);
        return null;
    }
};

const removeTmp = async (localFilePath) => {
    try {
        await fs.promises.unlink(localFilePath); // Use promises to handle the unlink
        console.log("Temporary file removed:", localFilePath);
    } catch (err) {
        console.log("Error removing temporary file:", localFilePath, err);
    }
};

// Function to delete an image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null;

        // Extract the public_id from the Cloudinary URL
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract filename without extension
        const folder = "Kumbh/"; // Folder name used during upload
        const fullPublicId = folder + publicId;

        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(fullPublicId);
        
        return result;
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return null;
    }
};

export { uploadToCloudinary, deleteFromCloudinary };
