import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Booking } from "../models/booking.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Tour } from "../models/tour.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import { sslczConfig } from "../config.js";
import { v4 as uuidv4 } from "uuid";
import { generateUid } from "../lib/utils.js";

export const getBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("tour")
      .populate("user")
      .populate("txHistory");

    return res.status(200).json(new ApiResponse(200, "Success", { bookings }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);
    if (!booking) throw new ApiError(400, "Booking not found");
    res.status(200).json(new ApiResponse(200, "Success", { booking }));
  } catch (error) {
    throw error;
  }
});

export const getUserBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user })
      .populate("tour")
      .populate("user")
      .populate("txHistory");

    return res.status(200).json(new ApiResponse(200, "Success", { bookings }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

const calculateCost = (perPersonCost, totalPerson, tax) => {
  const total = perPersonCost * totalPerson;
  const appliedTaxAmount = (tax / 100) * total;
  const totalCost = total + appliedTaxAmount;
  return { total, totalCost, appliedTaxAmount };
};

export const bookingInitiate = asyncHandler(async (req, res) => {
  const { tourId, totalPerson } = req.body;
  try {
    const trip = await Tour.findById(tourId).lean();
    if (!trip) throw new ApiError(404, "Trip doesn't exist");

    const transactionId = generateUid(16);
    const { totalCost, appliedTaxAmount } = calculateCost(
      trip.cost,
      totalPerson,
      trip.tax
    );

    const data = {
      total_amount: totalCost,
      currency: process.env.CURRENCY || "BDT",
      tran_id: transactionId,
      cus_name: req.user.fullName,
      cus_email: req.user.email,
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: req.user.country || "Bangladesh",
      cus_phone: req.user.phone || "0173456345",
      product_name: trip.title,
      product_category: "Travel",
      product_profile: "general",
      shipping_method: "NO",
      success_url: sslczConfig.paymentSuccessUrl,
      fail_url: sslczConfig.paymentFailureUrl,
      cancel_url: sslczConfig.paymentCancelUrl,
      ipn_url: sslczConfig.paymentIpnUrl,
    };

    const sslcz = new SSLCommerzPayment(
      sslczConfig.storeId,
      sslczConfig.storePassword,
      sslczConfig.isLive
    );

    sslcz.init(data).then(async (response) => {
      if (response?.status === "FAILED") {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: response.failedreason,
        });
      }

      await Booking.create({
        tx: transactionId,
        tour: trip._id,
        user: req.user._id,
        status: "PENDING",
        totalPerson,
        tax: trip.tax,
        appliedTaxAmount,
        perPersonCost: trip.cost,
        totalCost,
      });

      let GatewayPageURL = response.GatewayPageURL;
      return res.json(
        new ApiResponse(200, "Success", { redirectUrl: GatewayPageURL })
      );
    });
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const paymentSuccess = asyncHandler(async (req, res) => {
  const { tran_id, bank_tran_id, currency, amount, store_amount, card_type } =
    req.body;
  try {
    const transaction = await Transaction.create({
      transactionId: tran_id,
      bankTransactionId: bank_tran_id,
      currency,
      amount,
      storeAmount: store_amount,
      paymentMethod: card_type,
      status: "SUCCESS",
    });

    const booking = await Booking.findOne({ tx: tran_id }).populate(
      "txHistory"
    );
    booking.status = "SUCCESS";
    booking.txHistory.push(transaction._id);

    if (booking.isEdited) {
      const person = Math.floor(amount / booking.perPersonCost);
      const totalPerson = booking.totalPerson + person;
      const totalAmount = calculateCost(
        booking.perPersonCost,
        totalPerson,
        booking.tax
      );

      booking.totalPerson = totalPerson;
      booking.appliedTaxAmount = totalAmount.appliedTaxAmount;
      booking.totalCost = totalAmount.totalCost;
    }

    booking.isEdited = true;
    await booking.save();
    return res.redirect(sslczConfig.successRedirectUrl);
  } catch (error) {
    throw error;
  }
});

export const paymentFailed = asyncHandler(async (req, res) => {
  try {
    return res.redirect(sslczConfig.failedRedirectUrl);
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const paymentCancel = asyncHandler(async (req, res) => {
  try {
    return res.redirect(sslczConfig.canceledRedirectUrl);
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

export const modifyBooking = asyncHandler(async (req, res) => {
  const { bookingId, totalPerson } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate(
      "tour user txHistory"
    );

    const personDifference = totalPerson - booking.totalPerson;
    if (personDifference == 0)
      throw new ApiError(400, "Please cancel the order instead modify");

    if (personDifference > 0) {
      const cost = calculateCost(
        booking.perPersonCost,
        personDifference,
        booking.tax
      );

      const paymentLink = await generatePaymentLink(
        booking.tx,
        cost.totalCost,
        booking,
        booking.user
      );

      return res.json(
        new ApiResponse(200, "Payment required for additional persons", {
          paymentLink,
        })
      );
    }

    const amountToRefund = -personDifference * booking.perPersonCost;
    const remark = `Refund for reducing ${-personDifference} persons from booking`;
    const bankTransactionId = booking.txHistory[0]?.bankTransactionId;

    // Initiate the refund process
    const refundResponse = await processRefund(
      amountToRefund,
      remark,
      bankTransactionId
    );

    if (refundResponse.status !== "success")
      throw new ApiError(
        400,
        refundResponse.errorReason || "Failed to refund extra amount"
      );

    const transaction = await Transaction.create({
      transactionId: booking.tx,
      bankTransactionId: bankTransactionId,
      transactionType: "refund",
      amount: amountToRefund,
      refundReason: remark,
      status: "SUCCESS",
    });

    booking.totalPerson = totalPerson;
    booking.isEdited = true;
    booking.txHistory.push(transaction);
    await booking.save();

    // Return success response
    return res.json(
      new ApiResponse(200, "Booking modified successfully", { booking })
    );
  } catch (error) {
    throw error;
  }
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id).populate("tour user txHistory");
    if (!booking) throw new ApiError(404, "Booking not found");
    if (booking.status !== "SUCCESS")
      throw new ApiError(400, "Booking should not canclled or pending");

    const bookingAmount = booking.txHistory.reduce(
      (sum, item) => item?.storeAmount,
      0
    );

    const response = await processRefund(
      bookingAmount,
      "Booking cancalletion.",
      booking.txHistory[0].bankTransactionId
    );

    if (response.status !== "success")
      throw new ApiError(400, "Failed to cancel booking");

    const transaction = await Transaction.create({
      transactionId: response.trans_id,
      bankTransactionId: response.bank_tran_id,
      transactionType: "refund",
      status: "SUCCESS",
      amount: bookingAmount,
      refundReason: "Booking cancalletion.",
      refundRefId: response.refund_ref_id,
    });

    booking.status = "CANCELLED";
    booking.txHistory.push(transaction);
    await booking.save();
    res
      .status(200)
      .json(new ApiResponse(200, "Cancelled the booking", { booking }));
  } catch (error) {
    throw error;
  }
});

export const initiateRefund = asyncHandler(async (req, res) => {
  const { amount, reason, bankTransactionId } = req.body;
  try {
    const response = await processRefund(amount, reason, bankTransactionId);
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

const processRefund = async (amount, remark, bankTransactionId) => {
  const data = {
    refund_amount: amount,
    refund_remarks: remark,
    bank_tran_id: bankTransactionId,
  };

  const sslcz = new SSLCommerzPayment(
    sslczConfig.storeId,
    sslczConfig.storePassword,
    sslczConfig.isLive
  );

  return await sslcz.initiateRefund(data);
};

const generatePaymentLink = async (
  transactionId,
  amount,
  booking,
  customer
) => {
  const data = {
    total_amount: amount,
    currency: process.env.CURRENCY || "BDT",
    tran_id: transactionId,
    cus_name: customer.fullName,
    cus_email: customer.email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: customer.country || "Bangladesh",
    cus_phone: customer.phone || "0173456345",
    product_name: booking.tour.title,
    product_category: "Travel",
    product_profile: "general",
    shipping_method: "NO",
    success_url: sslczConfig.paymentSuccessUrl,
    fail_url: sslczConfig.paymentFailureUrl,
    cancel_url: sslczConfig.paymentCancelUrl,
    ipn_url: sslczConfig.paymentIpnUrl,
  };

  const sslcz = new SSLCommerzPayment(
    sslczConfig.storeId,
    sslczConfig.storePassword,
    sslczConfig.isLive
  );

  const response = await sslcz.init(data);

  if (response?.status === "FAILED") {
    throw new ApiError(400, response.failedreason);
  }

  return response.GatewayPageURL;
};
