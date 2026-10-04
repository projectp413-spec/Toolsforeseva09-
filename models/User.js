


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

        password: {
            type: String,
            required: true
        },

        // =====================================
        // USER ROLE
        // =====================================

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        // =====================================
        // BLOCK STATUS
        // =====================================

        isBlocked: {
            type: Boolean,
            default: false
        },

        // =====================================
        // EMAIL VERIFICATION
        // =====================================

        emailVerified: {
            type: Boolean,
            default: false
        },

        // =====================================
        // OTP RELATED FIELDS
        // =====================================

        otpHash: {
            type: String,
            default: null
        },

        otpExpiresAt: {
            type: Date,
            default: null
        },

        otpAttempts: {
            type: Number,
            default: 0
        },

        // =====================================
        // WALLET
        // =====================================

        walletBalance: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    }
);

const User = mongoose.model(
    "User",
    userSchema
);

export default User;