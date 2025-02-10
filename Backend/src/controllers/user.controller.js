import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendOtp from "../utils/sendOtp.js";
import jwt from "jsonwebtoken"; //Change_18
import UserProfile from "../models/userProfile.model.js"; // Adjust the path if necessary

const generateOtp = () => Math.floor(Math.random() * 10000).toString();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, phoneNumber: user.phoneNumber },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );
}; //change_18

const registerUser = asyncHandler(async (req, res) => {
    const { username, phoneNumber } = req.body;

    if (!(username || phoneNumber)) {
        throw new ApiError(400, "username or phone number missing");
    }

    let user = await User.findOne({ phoneNumber });

    if (user && user.isVerified) {
        throw new ApiError(400, "Number Already Exist");
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 300000; // OTP valid for 5 minutes (300,000ms)

    // If user exists but is not verified, update their OTP
    if (user) {
        user.otp = otp;
        user.otpExpiry = otpExpiry;
    }
    // Create a new user entry if the phone number is not registered
    else {
        user = new User({
            username,
            phoneNumber,
            otp,
            otpExpiry,
            isVerified: false,
        });
    }
    await user.save();

    await sendOtp(phoneNumber, otp);

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "OTP sent. Please verify to complete registration."
        )
    );
});

// Step 2: Verify OTP to complete registration

// const verifyOtp = asyncHandler(async (req, res) => {
//     const { phoneNumber, otp } = req.body;

//     if (!phoneNumber || !otp) {
//         throw new ApiError(400, "Phone number and OTP are required");
//     }

//     // Find the user by phone number
//     const user = await User.findOne({ phoneNumber });

//     if (!user) {
//         throw new ApiError(400, "User not found");
//     }

//     // Check if the OTP is correct
//     if (user.otp !== otp) {
//         throw new ApiError(400, "Invalid OTP");
//     }

//     // Check if the OTP has expired
//     if (Date.now() > user.otpExpiry) {
//         throw new ApiError(400, "OTP has expired. Please request a new one.");
//     }

//     // OTP is valid, complete registration by marking the user as verified
//     user.isVerified = true;
//     user.otp = null; // Clear OTP after verification
//     user.otpExpiry = null; // Clear OTP expiry
//     await user.save();

//     res.status(200).json(new ApiResponse(200, user, "Registration successful!"));
// });

const verifyOtp = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        throw new ApiError(400, "Phone number and OTP are required");
    }

    const user = await User.findOne({ phoneNumber });

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (Date.now() > user.otpExpiry) {
        throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    // OTP is valid, complete registration
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT
    const token = generateToken(user);
    console.log(token);

    // res.status(200).json(new ApiResponse(200, { user, token }, "Registration successful!"));
    // res.status(200).json({ status: 200, data: { user, token }, message: "Registration successful!" });
    res.status(200).json({ user, token });
}); //change_18

const verifyToken = asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(400, "Invalid token");
        }

        res.status(200).json(new ApiResponse(200, { user }, "Token is valid"));
    } catch (error) {
        res.status(401).json(
            new ApiResponse(401, null, "Token is invalid or expired")
        );
    }
}); //Change_18

const resendOtp = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        throw new ApiError(400, "Phone number is required");
    }

    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    // Generate a new OTP and update its expiry time
    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpiry = Date.now() + 300000; // New OTP valid for 5 minutes
    await user.save();

    // Send the new OTP
    await sendOtp(phoneNumber, newOtp);

    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "New OTP sent. Please verify to complete registration."
        )
    );
});
//Change_19

const userProfile = asyncHandler(async (req, res) => {
    const { fullName, dob, adharNumber, age, gender, address } = req.body;
    const userID = req.user?._id;

    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

   

    // Check if the profile already exists for the user
    const existingProfile = await UserProfile.findOne({ userID });
    if (existingProfile) {
        throw new ApiError(400, "User profile already exists");
    }

    // Create a new user profile
    const userProfile = new UserProfile({
        userID,
        fullName,
        dob,
        adharNumber,
        age,
        gender,
        address,
    });

    // Save the profile to the database
    const savedProfile = await userProfile.save();

    res.status(201).json(
        new ApiResponse(201, savedProfile, "User Profile created successfully")
    );
});

const userDetails = asyncHandler(async (req, res) => {
    const userID = req.user?._id;
    // const userID = req.params.user;  if want to get by params

    // Check if the user exists
    const user = await UserProfile.findOne({ userID }).populate("userID");
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
    }
    
    res.status(200).json(new ApiResponse(200, user, "User Details"));
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
    const { fullName, dob, adharNumber, age, gender, address } = req.body;
    const userID = req.user?._id;

    // Check if the user exists
    const user = await User.findById(userID);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    
    // Find the user's profile and update it
    const userProfile = await UserProfile.findOne({ userID });
    if (!userProfile) {
        throw new ApiError(404, "User profile not found");
    }

    // Update fields selectively (only update the provided fields)
    if (fullName) userProfile.fullName = fullName;
    if (dob) userProfile.dob = dob;
    if (adharNumber) userProfile.adharNumber = adharNumber;
    if (age) userProfile.age = age;
    if (gender) userProfile.gender = gender;
    if (address) userProfile.address = address;

    // Save the updated profile
    const updatedProfile = await userProfile.save();

    res.status(200).json(
        new ApiResponse(
            200,
            updatedProfile,
            "User Profile updated successfully"
        )
    );
});

export {
    registerUser,
    verifyOtp,
    verifyToken,
    resendOtp,
    userProfile,
    userDetails,
    updateUserDetails,
};
