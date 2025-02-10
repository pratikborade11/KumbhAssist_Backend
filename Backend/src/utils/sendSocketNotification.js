import { io, userSocketMap } from "../socket/socket.js"; // Import Socket.io and user map

/**
 * Sends a real-time notification to a specific user if they are online.
 * @param {string} receiverId - The user ID of the recipient.
 * @param {string} event - The event name.
 * @param {object} data - The event data payload.
 */

export const sendNotification = (receiverId, event, data) => {
    const receiverSocketId = userSocketMap[receiverId]; // Get receiver's socket ID

    if (receiverSocketId) {
        io.to(receiverSocketId).emit(event, data); // Emit event only if the user is online
        console.log(
            `🔔 Notification sent to user ${receiverId} for event: ${event}`
        );
    } else {
        console.log(`⚠️ User ${receiverId} is offline. Notification not sent.`);
    }
};
