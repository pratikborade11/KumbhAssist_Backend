import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
    {
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
        // message: {
        //     type: String,
        // },
        status: {
            type: String,
            enum: ["pending", "resolved"],
            default: "pending",
        },
        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const SOS = mongoose.model("SOS", sosSchema);

export default SOS;
