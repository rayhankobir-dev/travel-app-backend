import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { addQuestion } from "../controllers/faq.controller.js";
import { faqSchema } from "../validation/index.js";

const faqRoute = new Router();

faqRoute.post("/", validation(faqSchema.create), addQuestion);
faqRoute.put("/", validation(faqSchema.edit), addQuestion);
faqRoute.delete("/", validation(faqSchema.delete), addQuestion);

export default faqRoute;
