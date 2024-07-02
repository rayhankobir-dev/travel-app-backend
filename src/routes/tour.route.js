import { Router } from "express";
import path from "path";
import { validation } from "../middlewares/validator.middle.js";
import {
  createTrip,
  deleteTrip,
  getTrips,
  updateTrip,
  uploadImages,
  getTripsBySlug,
  getPopularTours,
  getTripById,
} from "../controllers/tour.controller.js";
import { tourSchema } from "../validation/index.js";
import multer from "../middlewares/multer.js";
import { ValidationSource } from "../helpers/validation.js";

const router = new Router();

// multer configure
const uploadPath = path.join(process.cwd(), "public", "uploads", "trips");
const upload = multer(uploadPath);

router.get("/", getTrips);
router.get("/popular", getPopularTours);
router.get("/:slug", getTripsBySlug);
router.get("/trip/:id", getTripById);
router.post("/", createTrip);
router.post("/upload-images", upload.array("images", 4), uploadImages);
router.put("/:id", updateTrip);
router.delete(
  "/:id",
  validation(tourSchema.id, ValidationSource.PARAM),
  deleteTrip
);

export default router;
