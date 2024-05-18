import { Router } from "express";
import { print } from "../controllers/printer.controller.js";
const router = Router()

router.route("/printbill").post(print)

export default router