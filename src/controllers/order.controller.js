import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Booking } from "../models/booking.model.js";
import { Transaction } from "../models/transaction.js";
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
    throw error;
  }
});

const calculateCost = (perPersonCost, totalPerson, tax) => {
  const total = perPersonCost * totalPerson;
  const appliedTaxAmount = (tax / 100) * total;
  const totalCost = total + appliedTaxAmount;
  return { total, totalCost, appliedTaxAmount };
};

export const orderInitiate = asyncHandler(async (req, res) => {
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
    throw error;
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

    const booking = await Booking.findOne({ tx: tran_id });
    booking.status = "SUCCESS";
    booking.isModified = true;
    booking.txHistory.push(transaction._id);

    await booking.save();
    res.redirect(sslczConfig.successRedirectUrl);
  } catch (error) {
    throw error;
  }
});

export const paymentFailed = asyncHandler(async (req, res) => {
  try {
    res.redirect(sslczConfig.failedRedirectUrl);
  } catch (error) {
    throw error;
  }
});

export const paymentCancel = asyncHandler(async (req, res) => {
  try {
    res.redirect(sslczConfig.canceledRedirectUrl);
  } catch (error) {
    throw error;
  }
});

export const modifyBooking = asyncHandler(async (req, res) => {
  const { bookingId, totalPerson } = req.body;
  try {
    const booking = await Booking.findById(bookingId).populate("tour user");
    const difference = totalPerson - booking.totalPerson;

    if (difference < 0) {
      const refundAmount = -difference * booking.perPersonCost;
      await initiateRefund(booking.tx, refundAmount);
    } else if (difference > 0) {
      const extraCost = difference * booking.perPersonCost;
      const paymentLink = await generatePaymentLink(
        extraCost,
        booking,
        booking.user
      );
      return res.json({ paymentLink });
    }

    booking.totalPerson = totalPerson;
    booking.isModified = true;
    await booking.save();

    return res.json(
      new ApiResponse(200, "Booking modified successfully", { booking })
    );
  } catch (error) {
    throw error;
  }
});

export const initiateRefund = asyncHandler(async (req, res) => {
  const { amount, reason, bankTransactionId } = req.body;
  try {
    await proccessRefund(res, amount, reason, bankTransactionId);
  } catch (error) {
    throw error;
  }
});

const proccessRefund = async (res, amount, remark, bankTransactionId) => {
  try {
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
    sslcz.initiateRefund(data).then(async (data) => {
      if (data.status === "failed") {
        res
          .status(400)
          .json(new ApiResponse(400, data.errorReason || "Failed to refund"));
      } else {
        await Transaction.create({
          amount: amount,
          transactionId: data.trans_id,
          bankTransactionId: data.bank_tran_id,
          transactionType: "refund",
          status: "SUCCESS",
          refundReason: remark,
          refundRefId: data.refund_ref_id,
        });

        res.status(200).json(new ApiResponse(200, `Amount ${amount} refunded`));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const generatePaymentLink = async (amount, booking, customer) => {
  const transactionId = uuidv4();

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

  await Booking.findByIdAndUpdate(booking._id, {
    $set: { tx: transactionId },
  });

  return response.GatewayPageURL;
};
