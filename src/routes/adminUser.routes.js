import { Router } from "express";
import { loginAdminUser, registerAdminUser } from "../controllers/adminUser.controller.js";

const router = Router()

router.route("/login").post(loginAdminUser)
router.route('/register').post(registerAdminUser)

export default router