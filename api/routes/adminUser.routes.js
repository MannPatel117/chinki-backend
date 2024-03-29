import { Router } from "express";
import { loginAdminUser, registerAdminUser, getUser, logoutUser, refreshAccessToken } from "../controllers/adminUser.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/login").post(loginAdminUser)
router.route('/register').post(registerAdminUser)
router.route('/refreshToken').post(refreshAccessToken)
router.route('/getUser').get(verifyJWT, getUser)
router.route('/logout').post(verifyJWT, logoutUser)


export default router