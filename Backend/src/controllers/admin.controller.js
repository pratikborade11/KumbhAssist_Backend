import Admin from "../models/admin.model.js"; // Path to your admin model
import ApiError from "../utils/ApiError.js"; // Handle errors
import ApiResponse from "../utils/ApiResponse.js"; // Handle responses
import { asyncHandler } from "../utils/asyncHandler.js"; // Async handler to manage async routes

// Admin Registration Controller
const registerAdmin = asyncHandler(async (req, res) => {
    const { username, phoneNumber, permissions, adminLevel } = req.body;

    if (!(username && phoneNumber)) {
        throw new ApiError(400, "Username or phone number missing");
    }

    const existingAdmin = await Admin.findOne({ phoneNumber });

    if (existingAdmin) {
        throw new ApiError(400, "Admin with this phone number already exists");
    }

    // Create a new admin with the provided information
    const newAdmin = new Admin({
        username,
        phoneNumber,
        permissions: permissions || ["view", "manage-users"], // Default permissions
        adminLevel: adminLevel || "basic", // Default to basic admin level
    });

    await newAdmin.save();

    // Send success response
    res.status(201).json(
        new ApiResponse(201, newAdmin, "Admin registered successfully!")
    );
});

export default registerAdmin;
