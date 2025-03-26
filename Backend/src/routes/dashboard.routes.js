import { Router } from "express";
import {
    getDashboardStat,
    getRecentSOSAlearts,
} from "../controllers/dashboard.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.route("/").get(isAdmin, getDashboardStat);

router.route("/recent-sos").get(isAdmin, getRecentSOSAlearts);

export default router;
