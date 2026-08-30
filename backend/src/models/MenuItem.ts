import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    canteenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canteen",
      required: true
    },
    isActive: {
  type: Boolean,
  default: true
},

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    

    image: {
      type: String,
      default: ""
    },

    preparationTime: {
      type: Number,
      required: true,
      min: 0
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;