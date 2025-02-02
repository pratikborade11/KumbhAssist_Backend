import {Router} from "express"
// import { registerUser, verifyOtp } from "../controllers/user.controller.js";
import { registerUser, verifyOtp, verifyToken , resendOtp, userProfile } from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoutes.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp)
router.route("/verify-token").post(verifyToken);
router.route("/resend-otp").post(resendOtp);//change_19_jan

router.route("/user-profile").post(protectRoute, userProfile);

export default router;