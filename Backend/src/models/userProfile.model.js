import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        adharNumber: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^[0-9]{12}$/.test(value); // Ensures it's a 12-digit numeric string
                },
                message: (props) => `${props.value} is not a valid Aadhaar number!`,
            },
        },
        age: {
            type: Number,
            required: true,
            min: 0,
        },
        gender: {
            type: String,
            required: true,
            // enum: ["male", "female"],
        },
        address: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile
