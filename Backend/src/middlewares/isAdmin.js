import ApiError from "../utils/ApiError.js";

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next(); // Allow the request to proceed
    } else {
        return res
            .status(403)
            .json(new ApiError(403, "Access denied. Admins only."));
    }
};

export default isAdmin;
