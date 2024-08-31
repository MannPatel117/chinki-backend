import { Router } from "express";
import { addProduct, editProduct, getProductbyID, getAllProducts, deleteProductbyID, productStats } from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/product").post(verifyJWT, addProduct)
router.route("/product").patch(verifyJWT, editProduct)
router.route("/product/:id").get(verifyJWT, getProductbyID)
router.route("/product").get(verifyJWT, getAllProducts)
router.route("/product").delete(verifyJWT, deleteProductbyID)
router.route("/stats").get(verifyJWT, productStats)


export default router