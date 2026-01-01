import {Router} from "express";
import { registerUser, loginUser, getAllStudents } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/getStudents").get(getAllStudents)




export default router;

