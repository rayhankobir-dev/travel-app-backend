import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import { 
    getOrders,
    modifyOrder,
    orderInitiate,
    paymentSuccess,
    paymentCancel,
    paymentFailed
} from "../controllers/order.controller.js";
import { orderSchema, tourSchema } from "../validation/index.js";
import auth from "../middlewares/authentication.middleware.js";

const orderRoute = new Router();

orderRoute.get("/", getOrders);
orderRoute.get("/initiate-payment", validation(orderSchema.init), auth, orderInitiate);
orderRoute.post("/payment-success", paymentSuccess);
orderRoute.post("/payment-failed", paymentFailed);
orderRoute.post("/payment-cancel", paymentCancel);
orderRoute.put("/", validation(tourSchema.edit), modifyOrder);

export default orderRoute;
