import express from "express";
import {
    reportIncident,
    getAllIncidents,
    getIncidentById,
    updateIncidentStatus,
    deleteIncident,
} from "../controllers/incident.controller.js";
import isAdmin from "../middlewares/isAdmin.js";
import protectRoute from "../middlewares/protectRoutes.js";

const router = express.Router();

// User can report an incident
router.post("/report", protectRoute, reportIncident);

// Admin can get all incidents
router.get("/all", isAdmin, getAllIncidents);
// Get a single incident by ID
router.get("/:incidentId", isAdmin, getIncidentById);
// Admin can update the status of an incident
router.put("/:incidentId/status", isAdmin, updateIncidentStatus);
// Admin can delete an incident
router.delete("/:incidentId", isAdmin, deleteIncident);

export default router;
