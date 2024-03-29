import { Router } from "express";
import { addMasterBill } from "../controllers/masterbill.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addMasterBill").post(verifyJWT, addMasterBill)
// router.route("/addTransactionPayment").post(verifyJWT, addTransactionPayment)
// router.route('/editTransactionSupply').patch(verifyJWT, editTransactionSupply)
// router.route('/editTransactionPayment').patch(verifyJWT, editTransactionPayment)
// router.route('/getTransactionbyID').get(verifyJWT, getTransactionbyID)
// router.route('/getAllTransaction').get(verifyJWT, getAllTransaction)
// router.route('/deleteTransactionbyID').post(verifyJWT, deleteTransactionbyID)

export default router