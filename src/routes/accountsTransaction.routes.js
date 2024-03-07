import { Router } from "express";
import { addTransaction, editTransaction, getTransactionbyID, getAllTransaction, deleteTransactionbyID } from "../controllers/accountsTransaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addTransaction").post(verifyJWT, addTransaction)
router.route('/editTransaction').patch(verifyJWT, editTransaction)
router.route('/getTransactionbyID').get(verifyJWT, getTransactionbyID)
router.route('/getAllTransaction').get(verifyJWT, getAllTransaction)
router.route('/deleteTransactionbyID').post(verifyJWT, deleteTransactionbyID)


export default router