import { Router } from "express";

import tourRoutes from "./tour.route.js";
import roleRoutes from "./role.route.js";
import authRouts from "./auth.route.js";
import locationRoute from "./location.route.js";
import faqRoutes from "./faq.route.js";
import highLightRoutes from "./high-light.route.js";
import serviceRoutes from "./tour-service.route.js";
import orderRoutes from "./order.route.js";
import auth from "../middlewares/authentication.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";

const routes = new Router();

routes.use("/auth", authRouts);
routes.use("/role", auth, authorization(["admin"]), roleRoutes);
routes.use("/location", locationRoute);
routes.use("/faq", faqRoutes);
routes.use("/highlight", highLightRoutes);
routes.use("/service", serviceRoutes);
routes.use("/trip", tourRoutes);
routes.use("/order", orderRoutes);

export default routes;
