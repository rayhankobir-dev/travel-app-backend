import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import auth from "../middlewares/authentication.middleware.js";
import { getAllTransaction } from "../controllers/transaction.controller.js";

const router = new Router();

router.get("/", getAllTransaction);

export default router;
