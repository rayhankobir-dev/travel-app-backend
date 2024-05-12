import { Router } from "express";
import { loginUser, signupUser } from "../controllers/user.controller.js";
import { validation } from "../middlewares/validator.middle.js";
import { userSchema } from "../validation/index.js";

const authRoute = new Router();

authRoute.post("/signup", validation(userSchema.signup), signupUser);
authRoute.post("/login", validation(userSchema.login), loginUser);

export default authRoute;
