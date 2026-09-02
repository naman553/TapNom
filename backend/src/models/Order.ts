import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
    },

    name: {
      type: String,
      required: true
    },
    preparationTime: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },

    canteenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canteen",
      required: true
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: unknown[]) => items.length > 0,
        message: "Order must contain at least one item"
      }
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    orderType: {
      type: String,
      enum: ["NORMAL", "EXPRESS"],
      default: "NORMAL"
    },

  basePriority: {
  type: Number,
  required: true,
  min: 0
},

    status: {
      type: String,
      enum: [
        "PLACED",
        "ACCEPTED",
        "PREPARING",
        "READY",
        "COMPLETED",
        "CANCELLED"
      ],
      default: "PLACED"
    },

    pickupSlot: {
      type: String,
      default: ""
    },

    estimatedReadyAt: {
      type: Date,
      default: null
    },

    acceptedAt: {
      type: Date,
      default: null
    },

    preparingAt: {
      type: Date,
      default: null
    },

    readyAt: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    },

    qrToken: {
    type: String,
    unique: true,
    sparse: true
    },

    qrGeneratedAt: {
    type: Date,
    default: null
    },

    pickupPinHash: {
    type: String,
    default: null,
    select : false 
    },

    pickupVerifiedAt: {
    type: Date,
    default: null
    },

    pickupVerificationMethod: {
    type: String,
    enum: ["QR", "PIN"],
    default: null
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;