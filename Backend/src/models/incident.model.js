import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // location: {
    //     type: String,
    //     required: true,
    // },
    location: {
        type: {
          latitude: {
            type: Number,
            required: true,
          },
          longitude: {
            type: Number,
            required: true,
          },
        },
        required: true,
      },
      title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "resolved"],
        default: "pending",
    },
    reportedAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date, // Will be set when the incident is resolved
    },
});

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
