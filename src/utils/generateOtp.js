import otpGenerator from "otp-generator";
import { Otp } from "../models/otp.model.js";
import {Resend} from "resend";
import dotenv from "dotenv"



dotenv.config({
   path: './.env'
})


const resend = new Resend(process.env.RESEND_API_KEY);


  const generateOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const sendEmail = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: email,
      subject: 'Verification Otp',
      html: `<p>Your OTP is <strong>${otp}</strong></p>`
    });
    
    
    return data; 

  } catch (error) {
    console.log("Email Service Error:", error);
    
    return null; 
  }
};

export { sendEmail, generateOtp };
