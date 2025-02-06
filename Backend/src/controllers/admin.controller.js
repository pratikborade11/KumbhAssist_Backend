import Admin from "../models/admin.model.js"; // Path to your admin model
import ApiError from "../utils/ApiError.js"; // Handle errors
import ApiResponse from "../utils/ApiResponse.js"; // Handle responses
import { asyncHandler } from "../utils/asyncHandler.js"; // Async handler to manage async routes

// Admin Registration Controller
const registerAdmin = asyncHandler(async (req, res) => {
    const { userName, password, phoneNumber, permissions, adminLevel } = req.body;

    if (!(userName && phoneNumber && password)) {
        throw new ApiError(400, "userName or phone number missing");
    }

    const existingAdmin = await Admin.findOne({ phoneNumber });

    if (existingAdmin) {
        throw new ApiError(400, "Admin with this phone number already exists");
    }

    // Create a new admin with the provided information
    const newAdmin = new Admin({
        userName,
        password,
        phoneNumber,
        permissions: permissions || ["view", "manage-admins"], // Default permissions
        adminLevel: adminLevel || "basic", // Default to basic admin level
    });

    await newAdmin.save();

    // Send success response
    res.status(201).json(
        new ApiResponse(201, newAdmin, "Admin registered successfully!")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    // Validate input
    if (!userName || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    // Check if admin exists
    const admin = await Admin.findOne({ userName });
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    console.log(admin);
    

    // Verify password
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate JWT token
    const token = await admin.generateToken();

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    // Fetch admin details without password
    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("jwt", token, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    token,
                },
                "Admin logged in successfully."
            )
        );
});

export { loginAdmin, registerAdmin };
