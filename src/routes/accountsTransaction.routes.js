import { Router } from "express";
import { addTransactionSupply ,addTransactionPayment, editTransactionSupply, editTransactionPayment, getTransactionbyID, getAllTransaction, deleteTransactionbyID } from "../controllers/accountsTransaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addTransactionSupply").post(verifyJWT, addTransactionSupply)
router.route("/addTransactionPayment").post(verifyJWT, addTransactionPayment)
router.route('/editTransactionSupply').patch(verifyJWT, editTransactionSupply)
router.route('/editTransactionPayment').patch(verifyJWT, editTransactionPayment)
router.route('/getTransactionbyID').get(verifyJWT, getTransactionbyID)
router.route('/getAllTransaction').get(verifyJWT, getAllTransaction)
router.route('/deleteTransactionbyID').post(verifyJWT, deleteTransactionbyID)


export default router