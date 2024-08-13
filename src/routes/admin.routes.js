import { Router } from "express";
import { registerAdmin, loginAdmin , patchAdmin, deleteAdmin, getAllAdmin, verifySession } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/usercreate').post(registerAdmin)
router.route('/user').post(loginAdmin)
router.route('/user').patch(verifyJWT, patchAdmin)
router.route('/user').delete(deleteAdmin)
router.route('/users').get(getAllAdmin)
router.route('/session').get(verifySession)

export default router