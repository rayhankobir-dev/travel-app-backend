import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import {
  getDistinctUsers,
  getUsersConversiations,
} from "../controllers/chat.controller.js";

const chatRoute = new Router();

chatRoute.get("/conversiations", getDistinctUsers);
chatRoute.get("/conversiations/:id", getUsersConversiations);
// chatRoute.get("/conversiations/:id", getUsersConversiations);

export default chatRoute;
