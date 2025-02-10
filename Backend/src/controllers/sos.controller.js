import { Types } from "mongoose";
import SOS from "../models/sos.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendNotification } from "../utils/sendSocketNotification.js";
import { ADMIN_ID } from "../constant.js";

const sendSOS = asyncHandler(async (req, res) => {
    const { userId, location, message } = req.body;

    if (!Types.ObjectId.isValid(userId)) {
        return res
            .status(400)
            .json(
                new ApiError(400, "Invalid SOS ID format", "Wrong Type Of ID")
            );
    }

    const sosRequest = await SOS.create({
        userId,
        location,
        message,
    });

    // Emit SOS event using Socket.io
    const adminId = ADMIN_ID;
    sendNotification(adminId, "newSOS", sosRequest);

    res.status(201).json(
        new ApiResponse(201, sosRequest, "SOS request created")
    );
});

const getSOSRequests = asyncHandler(async (req, res) => {
    const sosRequests = await SOS.find();
    res.status(200).json(new ApiResponse(200, sosRequests, "All Requests"));
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
