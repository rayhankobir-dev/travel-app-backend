import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import {
  getBookings,
  modifyBooking,
  orderInitiate,
  paymentSuccess,
  paymentCancel,
  paymentFailed,
  initiateRefund,
} from "../controllers/order.controller.js";
import { orderSchema, tourSchema } from "../validation/index.js";
import auth from "../middlewares/authentication.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";

const router = new Router();

router.get("/", auth, authorization(["admin"]), getBookings);
router.post("/make-payment", validation(orderSchema.init), auth, orderInitiate);
router.post("/payment-success", paymentSuccess);
router.post("/payment-failed", paymentFailed);
router.post("/payment-cancel", paymentCancel);
router.post("/payment-refund", initiateRefund);
router.put("/modify-booking", auth, modifyBooking);

export default router;
