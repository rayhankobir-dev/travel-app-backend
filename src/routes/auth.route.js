import { Router } from "express";
import { loginUser, signupUser } from "../controllers/user.controller.js";
import { validation } from "../middlewares/validator.middle.js";
import { userSchema } from "../validation/index.js";

const router = new Router();

router.post("/signup", validation(userSchema.signup), signupUser);
router.post("/login", validation(userSchema.login), loginUser);

export default router;
