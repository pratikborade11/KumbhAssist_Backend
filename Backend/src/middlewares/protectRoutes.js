import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// const protectRoute = async (req, res, next) => {
//     try {
//         // const token = req.cookies?.jwt;
//         // const token = req.body.token;
//         const token = req.headers.authorization;

//         if (!token) {
//             return res.status(401).json({ error: "Unauthorizes - No Token Provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if (!decoded) {
//             return res.status(401).json({ error: "Unauthorizes - Invalid Token" });
//         }

//         const user = await User.findById(decoded.id)

//         if (!user) {
//             return res.send(404).json({ error: "User not found" });
//         }

//         req.user = user;

//         next();

//     } catch (error) {
//         console.error("Error in protectRoute middleware: ", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            console.log("No token provided");
            return res
                .status(401)
                .json({ error: "Unauthorized - No Token Provided" });
        }

        console.log("Token received:", token); // Log the token for debugging

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            console.log("Invalid token");
            return res
                .status(401)
                .json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectRoute;
