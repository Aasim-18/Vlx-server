import { Router } from "express";
import { verifyOtp, Otpgenerate } from "../controllers/user.controller.js";

const router = Router();

router.route("/verify").post(verifyOtp)

router.route("/generateotp").post(Otpgenerate)

export default router