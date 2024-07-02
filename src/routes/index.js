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
import ApiResponse from "../helpers/ApiResponse.js";

const routes = new Router();

routes.use("/auth", authRouts);
routes.use("/user", auth, userRoutes);
routes.use("/locations", locationRoute);
routes.use("/trips", tourRoutes);
routes.use("/bookings", booking);
routes.use("/transactions", auth, transaction);
routes.use("/dashboard", auth, dashboard);
routes.use("/chats", auth, chatRoutes);

// health checking routes
routes.get("/", (req, res) => {
  res.status(200).json(new ApiResponse(200, "Success"));
});

export default routes;
