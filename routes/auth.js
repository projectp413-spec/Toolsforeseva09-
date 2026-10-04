







import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import User from "../models/User.js";

const router = express.Router();


// =====================================
// GENERATE OTP
// =====================================

function generateOTP() {

    return crypto
        .randomInt(100000, 1000000)
        .toString();

}


// =====================================
// SEND OTP EMAIL
// =====================================

async function sendOTPEmail(
    email,
    otp,
    purpose = "verification"
) {

    const transporter =
        nodemailer.createTransport({

            service: "gmail",

            auth: {

                user:
                    process.env.EMAIL_USER,

                pass:
                    process.env.EMAIL_PASS

            }

        });


    await transporter.sendMail({

        from:
            `"eSeva" <${process.env.EMAIL_USER}>`,

        to:
            email,

        subject:
            purpose === "reset"
                ? "eSeva Password Reset OTP"
                : "eSeva Email Verification OTP",

        html: `

            <div style="
                font-family: Arial, sans-serif;
                max-width: 550px;
                margin: auto;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-radius: 15px;
                background: #ffffff;
            ">

                <h2 style="
                    color: #5b4df5;
                    margin-bottom: 20px;
                ">

                    eSeva ${
                        purpose === "reset"
                            ? "Password Reset"
                            : "Email Verification"
                    }

                </h2>


                <p>

                    Your ${
                        purpose === "reset"
                            ? "password reset"
                            : "email verification"
                    } OTP is:

                </p>


                <div style="
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    padding: 20px 0;
                    color: #111827;
                ">

                    ${otp}

                </div>


                <p>

                    This OTP is valid for
                    <strong>10 minutes</strong>.

                </p>


                <p style="
                    color: #6b7280;
                    font-size: 13px;
                ">

                    If you did not request this,
                    you can safely ignore this email.

                </p>

            </div>

        `

    });

}


// =====================================
// REGISTER
// =====================================

router.post(
    "/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;


            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "All fields are required"

                });

            }


            if (
                password.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters"

                });

            }


            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();


            const existingUser =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            // =====================================
            // EXISTING USER
            // =====================================

            if (existingUser) {

                if (
                    existingUser.emailVerified
                ) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "Email already registered"

                    });

                }


                const otp =
                    generateOTP();


                existingUser.name =
                    name.trim();


                existingUser.password =
                    await bcrypt.hash(
                        password,
                        10
                    );


                existingUser.otpHash =
                    await bcrypt.hash(
                        otp,
                        10
                    );


                existingUser.otpExpiresAt =
                    new Date(
                        Date.now() +
                        10 * 60 * 1000
                    );


                existingUser.otpAttempts =
                    0;


                await existingUser.save();


                try {

                    await sendOTPEmail(
                        normalizedEmail,
                        otp
                    );

                } catch (emailError) {

                    console.error(
                        "Email error:",
                        emailError.message
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not send OTP email"

                    });

                }


                return res.status(200).json({

                    success: true,

                    message:
                        "New OTP sent to your email",

                    email:
                        normalizedEmail

                });

            }


            // =====================================
            // HASH PASSWORD
            // =====================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            // =====================================
            // GENERATE OTP
            // =====================================

            const otp =
                generateOTP();


            const otpHash =
                await bcrypt.hash(
                    otp,
                    10
                );


            const otpExpiresAt =
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                );


            // =====================================
            // CREATE USER
            // =====================================

            const user =
                await User.create({

                    name:
                        name.trim(),

                    email:
                        normalizedEmail,

                    password:
                        hashedPassword,

                    // Normal registration
                    // always creates USER
                    role:
                        "user",

                    // New users are not blocked
                    isBlocked:
                        false,

                    emailVerified:
                        false,

                    otpHash,

                    otpExpiresAt,

                    otpAttempts:
                        0,

                    walletBalance:
                        0

                });


            // =====================================
            // SEND OTP
            // =====================================

            try {

                await sendOTPEmail(
                    normalizedEmail,
                    otp
                );

            } catch (emailError) {

                console.error(
                    "Email sending failed:",
                    emailError.message
                );


                await User.findByIdAndDelete(
                    user._id
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not send verification email"

                });

            }


            return res.status(201).json({

                success: true,

                message:
                    "Registration successful. OTP sent to your email.",

                email:
                    user.email

            });


        } catch (error) {

            console.error(
                "Register error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// =====================================
// VERIFY OTP
// =====================================

router.post(
    "/verify-otp",
    async (req, res) => {

        try {

            const {
                email,
                otp
            } = req.body;


            if (
                !email ||
                !otp
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and OTP are required"

                });

            }


            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();


            const user =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            if (
                user.emailVerified
            ) {

                return res.json({

                    success: true,

                    message:
                        "Email already verified"

                });

            }


            // =====================================
            // CHECK EXPIRY
            // =====================================

            if (
                !user.otpExpiresAt ||
                user.otpExpiresAt < new Date()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "OTP expired. Please request a new OTP."

                });

            }


            // =====================================
            // LIMIT ATTEMPTS
            // =====================================

            if (
                user.otpAttempts >= 5
            ) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Too many incorrect attempts. Request a new OTP."

                });

            }


            // =====================================
            // CHECK OTP
            // =====================================

            const otpMatch =
                await bcrypt.compare(
                    otp.toString(),
                    user.otpHash
                );


            if (!otpMatch) {

                user.otpAttempts += 1;

                await user.save();


                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid OTP"

                });

            }


            // =====================================
            // VERIFY EMAIL
            // =====================================

            user.emailVerified =
                true;

            user.otpHash =
                null;

            user.otpExpiresAt =
                null;

            user.otpAttempts =
                0;


            await user.save();


            return res.json({

                success: true,

                message:
                    "Email verified successfully. You can now login."

            });


        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// =====================================
// RESEND OTP
// =====================================

router.post(
    "/resend-otp",
    async (req, res) => {

        try {

            const {
                email
            } = req.body;


            if (!email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required"

                });

            }


            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();


            const user =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            if (
                user.emailVerified
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is already verified"

                });

            }


            const otp =
                generateOTP();


            user.otpHash =
                await bcrypt.hash(
                    otp,
                    10
                );


            user.otpExpiresAt =
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                );


            user.otpAttempts =
                0;


            await user.save();


            await sendOTPEmail(
                normalizedEmail,
                otp
            );


            return res.json({

                success: true,

                message:
                    "New OTP sent successfully"

            });


        } catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Could not send OTP"

            });

        }

    }
);


// =====================================
// FORGOT PASSWORD - SEND OTP
// =====================================

router.post(
    "/forgot-password",
    async (req, res) => {

        try {

            const {
                email
            } = req.body;


            if (!email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required"

                });

            }


            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();


            const user =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "No account found with this email"

                });

            }


            if (
                !user.emailVerified
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Please verify your email first"

                });

            }


            const otp =
                generateOTP();


            user.otpHash =
                await bcrypt.hash(
                    otp,
                    10
                );


            user.otpExpiresAt =
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                );


            user.otpAttempts =
                0;


            await user.save();


            try {

                await sendOTPEmail(
                    normalizedEmail,
                    otp,
                    "reset"
                );

            } catch (emailError) {

                console.error(
                    "Password reset email error:",
                    emailError.message
                );


                user.otpHash =
                    null;

                user.otpExpiresAt =
                    null;

                user.otpAttempts =
                    0;


                await user.save();


                return res.status(500).json({

                    success: false,

                    message:
                        "Could not send password reset OTP"

                });

            }


            return res.json({

                success: true,

                message:
                    "Password reset OTP sent to your email",

                email:
                    normalizedEmail

            });


        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// =====================================
// RESET PASSWORD
// =====================================

router.post(
    "/reset-password",
    async (req, res) => {

        try {

            const {
                email,
                otp,
                newPassword
            } = req.body;


            if (
                !email ||
                !otp ||
                !newPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email, OTP and new password are required"

                });

            }


            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters"

                });

            }


            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();


            const user =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            if (
                !user.otpHash ||
                !user.otpExpiresAt
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No active OTP. Please request a new OTP."

                });

            }


            if (
                user.otpExpiresAt < new Date()
            ) {

                user.otpHash =
                    null;

                user.otpExpiresAt =
                    null;

                user.otpAttempts =
                    0;


                await user.save();


                return res.status(400).json({

                    success: false,

                    message:
                        "OTP expired. Please request a new OTP."

                });

            }


            if (
                user.otpAttempts >= 5
            ) {

                return res.status(429).json({

                    success: false,

                    message:
                        "Too many incorrect attempts. Please request a new OTP."

                });

            }


            const otpMatch =
                await bcrypt.compare(
                    otp.toString(),
                    user.otpHash
                );


            if (!otpMatch) {

                user.otpAttempts += 1;

                await user.save();


                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid OTP"

                });

            }


            // =====================================
            // UPDATE PASSWORD
            // =====================================

            user.password =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            // =====================================
            // CLEAR OTP
            // =====================================

            user.otpHash =
                null;

            user.otpExpiresAt =
                null;

            user.otpAttempts =
                0;


            await user.save();


            return res.json({

                success: true,

                message:
                    "Password reset successfully. You can now login."

            });


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// =====================================
// LOGIN
// =====================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required"

                });

            }


            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();


            const user =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // =====================================
            // CHECK EMAIL VERIFICATION
            // =====================================

            if (
                !user.emailVerified
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Please verify your email before logging in",

                    email:
                        user.email

                });

            }


            // =====================================
            // CHECK PASSWORD
            // =====================================

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // =====================================
            // CHECK BLOCK STATUS
            // =====================================

            if (
                user.isBlocked
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Your account has been blocked by admin"

                });

            }


            // =====================================
            // CREATE JWT
            // =====================================

            const token =
                jwt.sign(

                    {
                        userId:
                            user._id.toString(),

                        role:
                            user.role

                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "7d"
                    }

                );


            // =====================================
            // LOGIN RESPONSE
            // =====================================

            return res.json({

                success: true,

                message:
                    "Login successful",

                token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role,

                    emailVerified:
                        user.emailVerified,

                    isBlocked:
                        user.isBlocked,

                    walletBalance:
                        user.walletBalance

                }

            });


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


export default router;