// twilioConfig.js
import twilio from "twilio";
import "dotenv/config";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

const sendOtp = (phoneNumber, otp) => {
    return client.messages.create({
        body: `Your KumbhAssist verification code is: ${otp}. This code is valid for the next 10 minutes. Please do not share this code with anyone`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
    });
};

export default sendOtp;
