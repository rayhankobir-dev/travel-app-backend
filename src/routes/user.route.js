import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { roleSchem } from "../validation/index.js";
import { getProfile } from "../controllers/user.controller.js";
import auth from "../middlewares/authentication.middleware.js";

const userRoute = new Router();

userRoute.get("/profile", auth, getProfile);
userRoute.post("/", validation(roleSchem.create), getProfile);
userRoute.put("/", validation(roleSchem.create), getProfile);
userRoute.delete("/", validation(roleSchem.delete), getProfile);

export default userRoute;
