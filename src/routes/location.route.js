import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { locationSchema } from "../validation/index.js";
import {
  addLocation,
  deleteLocation,
  editLocation,
} from "../controllers/location.controller.js";

const locationRoute = new Router();

locationRoute.post("/", validation(locationSchema.create), addLocation);
locationRoute.put("/", validation(locationSchema.create), editLocation);
locationRoute.delete("/", validation(locationSchema.delete), deleteLocation);

export default locationRoute;