

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const ADMIN_EMAIL = "projectp413@gmail.com";
const ADMIN_PASSWORD = "Admin413@";

async function createAdmin() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("MongoDB connected ✅");


        const email =
            ADMIN_EMAIL
                .toLowerCase()
                .trim();


        const existingUser =
            await User.findOne({ email });


        // =====================================
        // EXISTING USER → MAKE ADMIN
        // =====================================

        if (existingUser) {

            existingUser.role = "admin";

            existingUser.emailVerified = true;

            await existingUser.save();

            console.log(
                `Admin created for existing user: ${email} ✅`
            );

            process.exit(0);
        }


        // =====================================
        // NEW ADMIN USER
        // =====================================

        const hashedPassword =
            await bcrypt.hash(
                ADMIN_PASSWORD,
                10
            );


        await User.create({

            name: "Admin",

            email,

            password: hashedPassword,

            role: "admin",

            emailVerified: true,

            otpHash: null,

            otpExpiresAt: null,

            otpAttempts: 0,

            walletBalance: 0

        });


        console.log(
            `New admin created: ${email} ✅`
        );

        process.exit(0);


    } catch (error) {

        console.error(
            "Admin creation failed ❌"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}

createAdmin();