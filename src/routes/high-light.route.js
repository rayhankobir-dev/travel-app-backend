import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { highLightSchema } from "../validation/index.js";
import {
  addHighlight,
  deleteHighlight,
  editHighlight,
} from "../controllers/high-light.controller.js";

const highLightRoute = new Router();

highLightRoute.post("/", validation(highLightSchema.create), addHighlight);
highLightRoute.put("/", validation(highLightSchema.edit), editHighlight);
highLightRoute.delete("/", validation(highLightSchema.delete), deleteHighlight);

export default highLightRoute;
