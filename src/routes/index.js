import { Router } from "express";

import tourRoutes from "./tour.route.js";
import authRouts from "./auth.route.js";
import locationRoute from "./location.route.js";
import booking from "./booking.route.js";
import transaction from "./transaction.route.js";
import auth from "../middlewares/authentication.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";
import chatRoutes from "./support.route.js";
import userRoutes from "./user.route.js";
import dashboard from "./dashboard.route.js";

const routes = new Router();

routes.use("/auth", authRouts);
routes.use("/user", userRoutes);
routes.use("/locations", locationRoute);
routes.use("/trips", tourRoutes);
routes.use("/bookings", booking);
routes.use("/transactions", transaction);
routes.use("/dashboard", dashboard);
routes.use("/chats", auth, chatRoutes);

export default routes;
