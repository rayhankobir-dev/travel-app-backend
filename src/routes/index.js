import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { userSchema } from "../validation/user.schema.js";
import { loginUser, signupUser } from "../controllers/user.controller.js";
import { createRole, deleteRole } from "../controllers/role.controller.js";

const routes = new Router();

routes.post("/signup", validation(userSchema.signup), signupUser);
routes.post("/login", validation(userSchema.login), loginUser);
routes.post("/role", createRole);
routes.delete("/role", deleteRole);

export default routes;
