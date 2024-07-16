import { Router } from "express";
import { addAccount, editAccount, getAccountbyID, getAllAccounts, deleteAccountbyID, getAccounts } from "../controllers/account.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addAccount").post(verifyJWT, addAccount)
router.route('/editAccount').patch(verifyJWT, editAccount)
router.route('/getAccountbyID').get(verifyJWT, getAccountbyID)
router.route('/getAllAccounts').get(verifyJWT, getAllAccounts)
router.route('/deleteAccountbyID').post(verifyJWT, deleteAccountbyID)
router.route('/getAccounts').get(verifyJWT, getAccounts)


export default router