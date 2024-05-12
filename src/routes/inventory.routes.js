import { Router } from "express";
import { addInventory, updateBillNumber, updateInvoiceNumber, editLowWarning, getInventorybyLocation, getInventoryDetailsbyLocation, getAllInventory, deleteInventorybyID } from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addInventory").post(addInventory)
router.route('/updateBillNumber').patch(verifyJWT, updateBillNumber)
router.route('/updateInvoiceNumber').patch(verifyJWT, updateInvoiceNumber)
router.route('/editLowWarning').patch(verifyJWT, editLowWarning)
router.route('/getInventorybyLocation').get(verifyJWT, getInventorybyLocation)
router.route('/getInventoryDetailsbyLocation').get(verifyJWT, getInventoryDetailsbyLocation)
router.route('/getAllInventory').get(verifyJWT, getAllInventory)
router.route('/deleteInventorybyID').post(deleteInventorybyID)


export default router