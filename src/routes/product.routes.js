import { Router } from "express";
import { addProduct, editProduct, getProductbyID, getAllProducts, deleteProductbyID } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addProducts").post(verifyJWT, addProduct)
router.route("/editProducts").patch(verifyJWT, editProduct)
router.route("/getProductbyID").get(verifyJWT, getProductbyID)
router.route("/getAllProducts").get(verifyJWT, getAllProducts)
router.route("/deleteProductbyID").get(verifyJWT, deleteProductbyID)


export default router