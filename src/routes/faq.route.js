import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import {
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "../controllers/faq.controller.js";
import { faqSchema } from "../validation/index.js";

const faqRoute = new Router();

faqRoute.get("/", getQuestions);
faqRoute.post("/", validation(faqSchema.create), addQuestion);
faqRoute.put("/", validation(faqSchema.edit), editQuestion);
faqRoute.delete("/", validation(faqSchema.delete), deleteQuestion);

export default faqRoute;
