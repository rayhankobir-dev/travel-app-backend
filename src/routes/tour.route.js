import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { 
    createTrip, 
    deleteTrip, 
    getTrips, 
    updateTrip
} from "../controllers/tour.controller.js";
import { tourSchema } from "../validation/index.js";

const tourRoute = new Router();

tourRoute.get("/", getTrips);
tourRoute.post("/", validation(tourSchema.create), createTrip);
tourRoute.put("/", validation(tourSchema.edit), updateTrip);
tourRoute.delete("/", validation(tourSchema.delete), deleteTrip);

export default tourRoute;
