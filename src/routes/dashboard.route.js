import express from "express";
import { validation } from "../middlewares/validator.middle.js";
import { getContent } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", getContent);

export default router;
