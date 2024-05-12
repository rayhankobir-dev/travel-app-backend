import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { createTrip } from "../controllers/tour.controller.js";
import { tourSchema } from "../validation/index.js";

const tourRoute = new Router();

tourRoute.post("/", validation(tourSchema.create), createTrip);

export default tourRoute;
