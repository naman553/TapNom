import mongoose from "mongoose";

const canteenSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
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

    location: {
      type: String,
      trim: true
    },

    image: {
      type: String,
      default: ""
    },

  openingTime: {
  type: String,
  default: ""
},

closingTime: {
  type: String,
  default: ""
},

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Canteen = mongoose.model("Canteen", canteenSchema);

export default Canteen;