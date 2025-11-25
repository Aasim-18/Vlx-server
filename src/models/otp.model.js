import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, 
    required: true,
  },

    otp: { type: String,
     required: true 
    },

    expiresAt: { type: Date,
   required: true
   }

  },
  { timestamps: true }
);


otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});


otpSchema.methods.validateOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

export const Otp = mongoose.model("Otp", otpSchema);
