import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js"; // Adjust path as needed
import ApiError from "../utils/ApiError.js";

const isAdmin = async (req, res, next) => {
    try {
        const token =
            req.cookies?.jwt || // 1. Check cookies
            req.headers["authorization"]?.split(" ")[1] || // 2. Check Authorization header (Bearer token)
            req.query.token; // 3. Check URL query parameter

        if (!token) {
            return res
                .status(401)
                .json(new ApiError(401, "Unauthorized. No token provided."));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch admin details from DB
        const admin = await Admin.findById(decoded._id);

        if (!admin || admin.role !== "admin") {
            return res
                .status(403)
                .json(new ApiError(403, "Access denied. Admins only."));
        }

        req.admin = admin; // Attach admin details to request
        next(); // Proceed to next middleware/controller
    } catch (error) {
        console.error("Admin Authentication Error:", error);
        return res
            .status(401)
            .json(new ApiError(401, "Invalid or expired token."));
    }
};

export default isAdmin;
