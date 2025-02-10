import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        image: { type: String, default: null }, // Optional image URL
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
