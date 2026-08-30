import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
  type: String,
  required: true
},

    role: {
      type: String,
      enum: ["STUDENT", "STAFF", "ADMIN"],
      default: "STUDENT"
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",

    },

    canteenId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Canteen"
}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;