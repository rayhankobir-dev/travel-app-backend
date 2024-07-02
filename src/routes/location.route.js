import { Router } from "express";
import { locationSchema } from "../validation/index.js";
import { validation } from "../middlewares/validator.middle.js";
import {
  getLocations,
  addLocation,
  deleteLocation,
  editLocation,
  popularDestanition,
} from "../controllers/location.controller.js";
import auth from "../middlewares/authentication.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";

const router = new Router();

router.get("/", getLocations);
router.get("/popular", popularDestanition);
router.post(
  "/",
  validation(locationSchema.create),
  auth,
  authorization(["admin"]),
  addLocation
);
router.put(
  "/",
  validation(locationSchema.edit),
  auth,
  authorization(["admin"]),
  editLocation
);
router.delete(
  "/",
  validation(locationSchema.delete),
  auth,
  authorization(["admin"]),
  deleteLocation
);

export default router;
