import { Router } from "express";

import tourRoutes from "./tour.route.js";
import roleRoutes from "./role.route.js";
import authRouts from "./auth.route.js";
import locationRoute from "./location.route.js";
import faqRoutes from "./faq.route.js";
import highLightRoutes from "./high-light.route.js";
import serviceRoutes from "./tour-service.route.js";

const routes = new Router();

routes.use("/auth", authRouts);
routes.use("/role", roleRoutes);
routes.use("/tour", tourRoutes);
routes.use("/location", locationRoute);
routes.use("/faq", faqRoutes);
routes.use("/highlight", highLightRoutes);
routes.use("/service", serviceRoutes);

export default routes;
