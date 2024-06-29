import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import {
  getDistinctUsers,
  getUsersConversiations,
} from "../controllers/chat.controller.js";

const router = new Router();

router.get("/conversiations", getDistinctUsers);
router.get("/conversiations/:id", getUsersConversiations);

export default router;
