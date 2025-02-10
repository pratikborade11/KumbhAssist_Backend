import { Router } from "express";
import {
    loginAdmin,
    logoutAdmin,
    registerAdmin,
} from "../controllers/admin.controller.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(isAdmin, logoutAdmin);

export default router;
