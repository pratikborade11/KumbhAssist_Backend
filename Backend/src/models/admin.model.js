import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define user schema for both regular users and admins
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        role: {
            type: String,
            default: "admin",
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION,
        }
    );
};

const Admin = mongoose.model("Admin", userSchema);

export default Admin;
