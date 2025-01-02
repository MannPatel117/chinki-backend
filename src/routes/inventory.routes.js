import { Router } from "express";
import { addInventory, updateBillNumber, updateInvoiceNumber, editLowWarning, getInventorybyLocation, getInventoryDetails, getAllInventory, deleteInventorybyID, lowInventory, inventoryStats } from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/inventory").post(addInventory)
router.route('/inventory/:location').get(verifyJWT, getInventorybyLocation)
router.route('/inventory').get(verifyJWT, getAllInventory)
router.route('/inventory').delete(deleteInventorybyID)

router.route('/inventoryDetail').get(verifyJWT, getInventoryDetails)


router.route('/stats').get(verifyJWT, inventoryStats)

router.route('/lowInventory').get(verifyJWT, lowInventory)
router.route('/lowInventory').patch(verifyJWT, editLowWarning)



router.route('/updateBillNumber').patch(verifyJWT, updateBillNumber)
router.route('/updateInvoiceNumber').patch(verifyJWT, updateInvoiceNumber)

export default router