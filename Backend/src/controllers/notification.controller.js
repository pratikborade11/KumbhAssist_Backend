import { Types } from "mongoose";
import Notification from "../models/notification.mode.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { io } from "../socket/socket.js"; // Import socket.io instance

// Helper function to get today's start and end time
const getTodayDateRange = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59)

    return { startOfDay, endOfDay };
};

// Admin sends a notification (broadcasts via Socket.io)
export const sendNotification = asyncHandler(async (req, res) => {
    const { title, message } = req.body;
    const adminId = req.admin._id; // Assume isAdmin middleware sets req.admin

    if (!title || !message) {
        return res
            .status(400)
            .json(new ApiError(400, "Title and message are required"));
    }

    let imageUrl = null;

    // Check if an image is uploaded
    if (req.files && req.files.image) {
        const uploadedImage = await uploadToCloudinary(req.files.image.tempFilePath);
        if (uploadedImage) {
            imageUrl = uploadedImage.secure_url;
        }
    }

    // Store notification in the database
    const notification = await Notification.create({ title, message, adminId, image: imageUrl });

    // Emit notification to all users except admin
    req.io.sockets.emit("newNotification", notification);

    res.status(201).json(new ApiResponse(201, notification, "Notification sent successfully"));
});

// User fetches only today's notifications
export const getTodayNotifications = asyncHandler(async (req, res) => {
    const { startOfDay, endOfDay } = getTodayDateRange();

    const todayNotifications = await Notification.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            todayNotifications,
            "Today's notifications fetched successfully"
        )
    );
});
