import { Router } from "express";
import { validation } from "../middlewares/validator.middle.js";
import {
  bookingInitiate,
  getBookings,
  modifyBooking,
  paymentSuccess,
  paymentCancel,
  paymentFailed,
  initiateRefund,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/order.controller.js";
import { orderSchema } from "../validation/index.js";
import auth from "../middlewares/authentication.middleware.js";
import authorization from "../middlewares/authorization.middleware.js";

const router = new Router();

router.get("/", auth, authorization(["admin"]), getBookings);
router.get("/my", auth, getUserBookings);
router.post(
  "/make-payment",
  validation(orderSchema.init),
  auth,
  bookingInitiate
);
router.get("/:id", getBookingById);
router.post("/payment-success", paymentSuccess);
router.post("/payment-failed", paymentFailed);
router.post("/payment-cancel", paymentCancel);
router.post("/payment-refund", initiateRefund);
router.put("/", auth, modifyBooking);
router.put("/cancel/:id", cancelBooking);

export default router;
