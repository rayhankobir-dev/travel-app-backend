import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { locationSchema } from "../validation/index.js";
import {
  getLocations,
  addLocation,
  deleteLocation,
  editLocation,
  popularDestanition,
} from "../controllers/location.controller.js";

const router = new Router();

router.get("/", getLocations);
router.get("/popular", popularDestanition);
router.post("/", validation(locationSchema.create), addLocation);
router.put("/", validation(locationSchema.edit), editLocation);
router.delete("/", validation(locationSchema.delete), deleteLocation);

export default router;
