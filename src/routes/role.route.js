import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { roleSchem } from "../validation/index.js";
import { 
    createRole, 
    deleteRole, 
    getRoles, 
    updateRole 
} from "../controllers/role.controller.js";

const roleRoute = new Router();

roleRoute.get("/", getRoles);
roleRoute.post("/", validation(roleSchem.create), createRole);
roleRoute.put("/", validation(roleSchem.create), updateRole);
roleRoute.delete("/", validation(roleSchem.delete), deleteRole);

export default roleRoute;
