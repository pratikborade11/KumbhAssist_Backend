import mongoose from "mongoose";

// Define user schema for both regular users and admins
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            default: "admin"
        },
        permissions: {
            type: [String], // List of permissions for admin
            default: ["view", "manage-users"], // Example permissions for admins
        },
        lastLogin: {
            type: Date,
        },
        adminLevel: {
            type: String,
            enum: ["basic", "super"], // Define admin levels (if needed)
            default: "basic",
        },
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.model("Admin", userSchema);

export default Admin;
