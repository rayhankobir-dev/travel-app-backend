import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Tour } from "../models/tour.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import { sslczConfig } from "../config.js";
import { v4 as uuidv4 } from 'uuid';

export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();

    return res.status(200).json(new ApiResponse(200, "Success", {orders}));
  } catch(error) {
    throw error;
  }
})

export const orderInitiate = asyncHandler(async (req, res) => {
  const { tourId, totalPerson, } = req.body;
  try {
    const trip = await Tour.findById(tourId).lean();
    if(!trip) throw new ApiError(404, "Trip doesn't exist");
    
    const totalCost = trip.cost * totalPerson;
    const appliedTax = (trip.tax / 100) * totalCost;
    const transactionId = uuidv4();

    const data = {
        total_amount: totalCost,
        currency: process.env.CURRENCY || "BDT",
        tran_id: transactionId,
        cus_name: req.user.fullName,
        cus_email: req.user.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: req.user.country || "Bangladesh",
        cus_phone: req.user.phone || "0173456345",
        product_name: trip.title,
        product_category: 'Electronic',
        product_profile: 'general',
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
          message: response.failedreason
        });
      }

      await Order.create({
        tour: trip,
        user: req.user,
        status: "pending",
        totalPerson,
        tax: trip.tax,
        appliedTax,
        perPersonCost: trip.cost,
        totalCost,
        transactionId
      })

      let GatewayPageURL = response.GatewayPageURL
      return res.json(new ApiResponse(200, "Success", {redirectUrl: GatewayPageURL}))
    });
  } catch(error) {
    throw error;
  }
})

export const paymentSuccess = asyncHandler(async (req, res) => {
  try {
    await Order.updateOne({
      transactionId: req.body.tran_id,
    }, {
      status: "success",
      paymentAmount: req.body.amount,
      paymentMethod: req.body.card_type,
      paymentTX: req.body.bank_tran_id,
      paymentedAt: req.body.tran_date,
      orderPlacedAt: req.body.tran_date,
      isEdited: false
    })

    return res.status(200).json(new ApiResponse(200, "Trip successfully booked"));
  } catch (error) {
    throw error;
  }
});

export const paymentFailed = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json(new ApiResponse(200, "Payment failed please go back & try again!"));
  } catch(error) {
    throw error;
  }
})

export const paymentCancel = asyncHandler(async (req, res) => {
  try {
    await Order.findOneAndDelete({ transactionId: req.body.tran_id });
    return res.status(200).json(new ApiResponse(200, "You canceled the payment"));
  } catch(error) {
    throw error;
  }
})

export const modifyOrder = asyncHandler(async (req, res) => {
  const { questionId, ...data } = req.body;
  try {
    const question = await TourFaq.findById(questionId);
    if (!question) throw new ApiError(404, "Question doesn't exist");

    const updatedQuestion = await TourFaq.findByIdAndUpdate(questionId, data, { new: true });

    return res.status(200).json(
      new ApiResponse(200, "Question has been successfully updated", {
        question: updatedQuestion,
      })
    );
  } catch (error) {
    throw error;
  }
});
