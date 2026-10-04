

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "ERROR"],
      default: "PENDING"
    },

    paymentUrl: {
      type: String,
      default: null
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    creditedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);