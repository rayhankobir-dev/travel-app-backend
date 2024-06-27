import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { roleSchem } from "../validation/index.js";
import { getProfile, getUsers } from "../controllers/user.controller.js";
import auth from "../middlewares/authentication.middleware.js";

const router = new Router();

router.get("/", getUsers);
router.get("/profile", auth, getProfile);
router.post("/", validation(roleSchem.create), getProfile);
router.put("/", validation(roleSchem.create), getProfile);
router.delete("/", validation(roleSchem.delete), getProfile);

export default router;
