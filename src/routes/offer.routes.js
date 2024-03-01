import { Router } from "express";
import { addOffer, editOffer, getOffersbyID, getAllOffers, deleteOfferbyID, addBillinOffer, getAllActiveOffers } from "../controllers/offer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addOffer").post(verifyJWT, addOffer)
router.route("/editOffer").patch(verifyJWT, editOffer)
router.route("/getOffersbyID").get(verifyJWT, getOffersbyID)
router.route("/getAllOffers").get(verifyJWT, getAllOffers)
router.route("/deleteOfferbyID").get(verifyJWT, deleteOfferbyID)
router.route("/addBillinOffer").post(verifyJWT, addBillinOffer)
router.route("/getAllActiveOffers").get(verifyJWT, getAllActiveOffers)

export default router