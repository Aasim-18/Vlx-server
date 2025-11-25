import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { Otp } from "../models/otp.model.js";

const generateOtp = async () => {
  const otp = otpGenerator.generate(6, {
    Numbers: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  return true;
};

export { sendEmail, generateOtp };
