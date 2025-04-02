import Incident from "../models/incident.model.js";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
    deleteFromCloudinary,
    uploadToCloudinary,
} from "../utils/uploadCloudinary.js";
import { ADMIN_ID } from "../constant.js";
import { sendNotification } from "../utils/sendSocketNotification.js";
import ApiFeatures from "../utils/ApiFeatures.js";

// Create a new incident report
export const reportIncident = asyncHandler(async (req, res) => {
    const { description, title } = req.body;
    let { location } = req.body;
    const userId = req.user?._id;
    const image = req.files.image;
    location = JSON.parse(location); // ✅ Convert location back to an object

    if (!image) {
        return res.status(400).json(new ApiError(400, "Provide Image"));
    }

    if (!Types.ObjectId.isValid(userId)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid user ID format"));
    }
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

    const secureUrl = await uploadToCloudinary(image.tempFilePath);

    // console.log(secureUrl);

    const incident = await Incident.create({
        userId,
        title,
        location,
        description,
        image: secureUrl.secure_url,
    });

    // here socket.io
    // from here socket.io is used to send notification
    // Send real-time notification to the admin
    const adminId = ADMIN_ID; // Replace with actual admin user ID from DB
    sendNotification(adminId, "newIncident", incident);

    res.status(201).json(
        new ApiResponse(201, incident, "Incident reported successfully")
    );
});

// Get all incident reports (for admin)
export const getAllIncidents = asyncHandler(async (req, res) => {
    const apiFeatures = new ApiFeatures(
        Incident.find().populate("userId", "username phoneNumber"),
        req.query
    )
        .filtering()
        .sorting()
        .pagination();

    const incidents = await apiFeatures.query.exec();

    res.status(200).json(
        new ApiResponse(200, incidents, `Incidents: ${incidents.length}`)
    );
});

// Get a specific incident by ID
export const getIncidentById = asyncHandler(async (req, res) => {
    const { incidentId } = req.params;

    if (!Types.ObjectId.isValid(incidentId)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid incident ID format"));
    }

    const incident = await Incident.findById(incidentId).populate("userId");

    if (!incident) {
        return res.status(404).json(new ApiError(404, "Incident not found"));
    }

    res.status(200).json(new ApiResponse(200, incident, "Incident details"));
});

// Update the status of an incident (Admin action)
export const updateIncidentStatus = asyncHandler(async (req, res) => {
    const { incidentId } = req.params;
    const { status } = req.body;

    if (!Types.ObjectId.isValid(incidentId)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid incident ID format"));
    }

    if (!["pending", "in-progress", "resolved"].includes(status)) {
        return res.status(400).json(new ApiError(400, "Invalid status value"));
    }

    const updatedIncident = await Incident.findByIdAndUpdate(
        incidentId,
        { status, resolvedAt: status === "resolved" ? Date.now() : null },
        { new: true }
    );

    if (!updatedIncident) {
        return res.status(404).json(new ApiError(404, "Incident not found"));
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedIncident,
            `Incident status updated to ${status}`
        )
    );
});

// Delete an incident (Admin action)
export const deleteIncident = asyncHandler(async (req, res) => {
    const { incidentId } = req.params;

    if (!Types.ObjectId.isValid(incidentId)) {
        return res
            .status(400)
            .json(new ApiError(400, "Invalid incident ID format"));
    }

    // Find the incident first
    const incident = await Incident.findById(incidentId);

    if (!incident) {
        return res.status(404).json(new ApiError(404, "Incident not found"));
    }

    // Delete the image from Cloudinary
    await deleteFromCloudinary(incident.image);

    // Delete the incident from the database
    await Incident.findByIdAndDelete(incidentId);

    res.status(200).json(
        new ApiResponse(200, incident, "Incident deleted successfully")
    );
});
