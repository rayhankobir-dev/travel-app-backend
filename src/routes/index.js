import { Router } from "express";

import tourRoutes from "./tour.route.js";
import authRouts from "./auth.route.js";
import locationRoute from "./location.route.js";
import faqRoutes from "./faq.route.js";
import highLightRoutes from "./high-light.route.js";
import serviceRoutes from "./tour-service.route.js";
import orderRoutes from "./order.route.js";
import auth from "../middlewares/authentication.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";
import chatRoutes from "./support.route.js";
import userRoutes from "./user.route.js";

const routes = new Router();

routes.use("/auth", authRouts);
routes.use("/user", auth, userRoutes);
routes.use("/locations", locationRoute);
routes.use("/faqs", faqRoutes);
routes.use("/highlights", highLightRoutes);
routes.use("/services", serviceRoutes);
routes.use("/trips", tourRoutes);
routes.use("/orders", orderRoutes);
routes.use("/chats", chatRoutes);

export default routes;
