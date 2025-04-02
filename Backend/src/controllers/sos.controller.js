import { Types } from "mongoose";
import SOS from "../models/sos.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../utils/sendSocketNotification.js";
import { ADMIN_ID } from "../constant.js";
import ApiFeatures from "../utils/ApiFeatures.js";

// const sendSOS = asyncHandler(async (req, res) => {
//     const { location } = req.body;
//     const userId = req.user?._id;

//     if (!Types.ObjectId.isValid(userId)) {
//         return res
//             .status(400)
//             .json(
//                 new ApiError(400, "Invalid SOS ID format", "Wrong Type Of ID")
//             );
//     }
//     const parsedLocation = JSON.parse(location);
//     const sosRequest = await SOS.create({
//         userId,
//         location : parsedLocation,
//         // message,
//     });

//     // Emit SOS event using Socket.io
//     // sendSocketNotification("newSOS", sosRequest);

//     res.status(201).json(
//         new ApiResponse(201, sosRequest, "SOS request created")
//     );
// });

const sendSOS = asyncHandler(async (req, res) => {
    const { location } = req.body; // Get the location object from request body
    const userId = req.user?._id;

    if (!Types.ObjectId.isValid(userId)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid User ID", "Wrong Type of ID"));
    }

    // Ensure the location is valid (should be an object with latitude and longitude)
    if (!location || !location.latitude || !location.longitude) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "Invalid location",
                    "Location must contain latitude and longitude"
                )
            );
    }

    const sosRequest = await SOS.create({
        userId,
        location, // Save location object directly
    });

    // Emit SOS event using Socket.io
    const adminId = ADMIN_ID;
    sendNotification(adminId, "newSOS", sosRequest);

    res.status(201).json(
        new ApiResponse(201, sosRequest, "SOS request created")
    );
});

// http://localhost:3000/api/v1/sos?page=1&limit=12

const getSOSRequests = asyncHandler(async (req, res) => {
    const apiFeatures = new ApiFeatures(
        SOS.find().populate("userId", "username phoneNumber"),
        req.query
    )
        .filtering()
        .sorting()
        .pagination();

    const sosRequests = await apiFeatures.query.exec(); // Execute the query
    res.status(200).json(
        new ApiResponse(200, sosRequests, `All Requests ${sosRequests.length}`)
    );
});

const resolveSOS = asyncHandler(async (req, res) => {
    const { sosId } = req.params;

    if (!Types.ObjectId.isValid(sosId)) {
        return res.status(400).json(new ApiError(400, "Invalid SOS ID format"));
    }

    const sosRequest = await SOS.findByIdAndUpdate(
        sosId,
        { status: "resolved", resolvedAt: Date.now() },
        { new: true }
    );

    if (!sosRequest)
        return res.status(404).json(new ApiError(404, "SOS request not found"));

    res.status(200).json(
        new ApiResponse(
            200,
            sosRequest,
            `SOS request ${sosId} resolved successfully`
        )
    );
});

export { sendSOS, getSOSRequests, resolveSOS };
