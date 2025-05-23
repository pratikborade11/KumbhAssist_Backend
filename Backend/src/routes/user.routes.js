import { Router } from "express";
// import { registerUser, verifyOtp } from "../controllers/user.controller.js";
import {
    registerUser,
    verifyOtp,
    verifyToken,
    resendOtp,
    userProfile,
    userDetails,
    updateUserDetails,
} from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoutes.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/verify-token").post(verifyToken);
router.route("/resend-otp").post(resendOtp); //change_19_jan

router
    .route("/user-profile")
    .post(protectRoute, userProfile)
    .patch(protectRoute, updateUserDetails);

// router.route("/user-profile").post(userProfile).patch(updateUserDetails);    for testing purpose

router.route("/user-details").get(protectRoute,userDetails);

export default router;
