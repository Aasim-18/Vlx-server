import {Router } from "express";
import { markAttendance } from "../controllers/attendence.controller.js";

const router = Router();

router.route("/mark").post(markAttendance);
export default router;