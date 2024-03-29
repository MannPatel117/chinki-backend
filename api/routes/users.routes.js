import { Router } from "express";
import { addUser, editUser, getUserbyID, getAllUsers, getUserbyNumber, deleteUserbyID } from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addUser").post(verifyJWT, addUser)
router.route('/editUser').patch(verifyJWT, editUser)
router.route('/getUserbyID').get(verifyJWT, getUserbyID)
router.route('/getAllUsers').get(verifyJWT, getAllUsers)
router.route('/getUserbyNumber').get(verifyJWT, getUserbyNumber)
router.route('/deleteUserbyID').post(verifyJWT, deleteUserbyID)


export default router