import express from "express";
import {
    sendNotification,
    getTodayNotifications,
} from "../controllers/notification.controller.js";
import isAdmin from "../middlewares/isAdmin.js"; // Admin auth middleware
import protectRoutes from "../middlewares/protectRoutes.js";

const router = express.Router();

// Admin sends a notification
router.post("/send", isAdmin, sendNotification);

// Users fetch today's notifications only
router.get("/today", getTodayNotifications);

export default router;
