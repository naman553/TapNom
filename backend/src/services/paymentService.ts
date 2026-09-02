
import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../models/Payment";
import Order from "../models/Order";

export const markCashPaymentAsPaid = async (
  orderId: string,
  canteenId: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
      canteenId
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return {
        error: "Order not found"
      };
    }

    if (order.paymentStatus === "PAID") {
      await session.abortTransaction();

      return {
        error: "Order is already paid"
      };
    }

    const payment = await Payment.findOne({
      orderId,
      method: "CASH",
      status: "PENDING"
    }).session(session);

    if (!payment) {
      await session.abortTransaction();

      return {
        error: "Pending cash payment not found"
      };
    }

    payment.status = "PAID";

    await payment.save({
      session
    });

    order.paymentStatus = "PAID";

    await order.save({
      session
    });

    await session.commitTransaction();

    return {
      order,
      payment
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


export const markOnlinePaymentAsPaid = async (
  paymentId: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const payment = await Payment.findById(
      paymentId
    ).session(session);

    if (!payment) {
      await session.abortTransaction();

      return {
        error: "Payment not found"
      };
    }

    if (payment.method !== "ONLINE") {
      await session.abortTransaction();

      return {
        error: "This is not an online payment"
      };
    }

    if (payment.status === "PAID") {
      await session.abortTransaction();

      return {
        error: "Payment is already paid"
      };
    }

    if (payment.status !== "PENDING") {
      await session.abortTransaction();

      return {
        error: "Payment cannot be completed"
      };
    }

    // Mark payment as paid
    payment.status = "PAID";
    payment.transactionId = `MOCK_${Date.now()}`;

    await payment.save({
      session
    });

    // Update corresponding order
    const order = await Order.findById(
      payment.orderId
    ).session(session);

    if (!order) {
      await session.abortTransaction();

      return {
        error: "Order not found"
      };
    }

    order.paymentStatus = "PAID";

    await order.save({
      session
    });

    await session.commitTransaction();

    return {
      payment,
      order
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


export const verifyRazorpayPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  userId: string
) => {
  const payment = await Payment.findOne({
    razorpayOrderId,
    userId,
    method: "ONLINE"
  });

  if (!payment) {
    return {
      error: "Payment not found"
    };
  }

  if (payment.status === "PAID") {
    return {
      error: "Payment is already completed"
    };
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }

  const generatedSignature = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${payment.razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return {
      error: "Invalid payment signature"
    };
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const paymentInTransaction = await Payment.findById(
      payment._id
    ).session(session);

    if (!paymentInTransaction) {
      await session.abortTransaction();

      return {
        error: "Payment not found"
      };
    }

    paymentInTransaction.status = "PAID";
    paymentInTransaction.razorpayPaymentId =
      razorpayPaymentId;
    paymentInTransaction.transactionId =
      razorpayPaymentId;

    await paymentInTransaction.save({
      session
    });

    const order = await Order.findById(
      paymentInTransaction.orderId
    ).session(session);

    if (!order) {
      await session.abortTransaction();

      return {
        error: "Order not found"
      };
    }

    order.paymentStatus = "PAID";

    await order.save({
      session
    });

    await session.commitTransaction();

    return {
      payment: paymentInTransaction,
      order
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};