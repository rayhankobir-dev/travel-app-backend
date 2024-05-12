import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { serviceSchema } from "../validation/index.js";
import {
  addService,
  deleteService,
  editService,
} from "../controllers/tour-service.controller.js";

const serviceRoute = new Router();

serviceRoute.post("/", validation(serviceSchema.create), addService);
serviceRoute.put("/", validation(serviceSchema.edit), editService);
serviceRoute.delete("/", validation(serviceSchema.delete), deleteService);

export default serviceRoute;
