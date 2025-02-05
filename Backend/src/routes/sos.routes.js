import { Router } from "express";
import {
    getSOSRequests,
    sendSOS,
    resolveSOS,
} from "../controllers/sos.controller.js";
import isAdmin from '../middlewares/isAdmin.js'

const router = Router();

// Route for sending an SOS request
router.route("/send").post(sendSOS);

// Route for retrieving all SOS requests (for admins)
router.route("/").get(getSOSRequests);

// Route for resolving an SOS request
router.route("/:sosId/resolve").patch(isAdmin , resolveSOS);

export default router;
