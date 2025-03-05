import { Router } from "express";
import { deleteUser } from "../../controllers/user/index.js";

import verifyToken from "../../middlewares/verifyToken.middleware.js";

const router = Router();

router.delete("/delete", verifyToken, deleteUser)

export default router;
