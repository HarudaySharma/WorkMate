import { Router } from "express";
import { deleteUser, userInfo } from "../../controllers/user/index.js";

import verifyToken from "../../middlewares/verifyToken.middleware.js";

const router = Router();

router.get("/me", verifyToken, userInfo)
router.delete("/delete", verifyToken, deleteUser)

export default router;
