import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { createRole, deleteRole } from "../controllers/role.controller.js";
import { roleSchem } from "../validation/index.js";

const roleRoute = new Router();

roleRoute.post("/", validation(roleSchem.create), createRole);
roleRoute.delete("/", validation(roleSchem.delete), deleteRole);

export default roleRoute;
