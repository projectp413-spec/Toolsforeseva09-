

import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "CREDIT",
                "DEBIT"
            ],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        balanceBefore: {
            type: Number,
            required: true
        },

        balanceAfter: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            default: "Wallet transaction"
        },

        status: {
            type: String,
            enum: [
                "SUCCESS",
                "FAILED",
                "PENDING"
            ],
            default: "SUCCESS"
        },

        referenceId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.WalletTransaction ||
    mongoose.model(
        "WalletTransaction",
        walletTransactionSchema
    );