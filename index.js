




// =====================================================
// ENVIRONMENT VARIABLES
// IMPORTANT: dotenv must load BEFORE importing routes
// =====================================================

import "dotenv/config";


// =====================================================
// CORE
// =====================================================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";


// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/auth.js";

import aadhaarRoutes from "./routes/aadhaar.js";
import panRoutes from "./routes/pan.js";
import rcRoutes from "./routes/rc.js";
import dlRoutes from "./routes/dl.js";
import rationRoutes from "./routes/ration.js";
import farmerRoutes from "./routes/farmer.js";
import mobileRoutes from "./routes/mobile.js";
import npciRoutes from "./routes/npci.js";
import upRationRoutes from "./routes/upRation.js";
import challanRoutes from "./routes/challan.js";
import voterRoutes from "./routes/voter.js";

import gstRoutes from "./routes/gst.js";
import gstDetailsRoutes from "./routes/gstDetails.js";

import ifscRoutes from "./routes/ifsc.js";
import llRoutes from "./routes/ll.js";
import llStatusRoutes from "./routes/llStatus.js";


// =====================================================
// ADDITIONAL ROUTES
// =====================================================

import uidToNameRoutes from "./routes/uidToName.js";
import aadhaarPanLinkCheckRoutes from "./routes/aadhaarPanLinkCheck.js";
import aadhaarDataCheckRoutes from "./routes/aadhaarDataCheck.js";
import aadhaarDetailsRoutes from "./routes/aadhaarDetails.js";
import enrolmentStatusRoutes from "./routes/enrolmentStatus.js";
import aadharVerifyRoutes from "./routes/aadharVerify.js";


// =====================================================
// PAN
// =====================================================

import panToMaskedAadhaarRoutes from "./routes/panToMaskedAadhaar.js";
import panToAadhaarRoutes from "./routes/panToAadhaar.js";
import panToNameRoutes from "./routes/panToName.js";
import panBasicRoutes from "./routes/panBasic.js";
import panPrimeRoutes from "./routes/panPrime.js";
import panByGstRoutes from "./routes/panByGst.js";


// =====================================================
// VOTER
// =====================================================

import voterVerificationRoutes from "./routes/voterVerification.js";
import voterMobileChangeRoutes from "./routes/voterMobileChange.js";
import voterDownloadSendOtpRoutes from "./routes/voterDownloadSendOtp.js";
import voterDownloadVerifyRoutes from "./routes/voterDownloadVerify.js";
import voterMobileLinkRoutes from "./routes/voterMobileLink.js";


// =====================================================
// RATION
// =====================================================

import rationToUidRoutes from "./routes/rationToUid.js";
import aadhaarToRationRoutes from "./routes/aadhaarToRation.js";
import rationBasicDetailsRoutes from "./routes/rationBasicDetails.js";


// =====================================================
// VEHICLE
// =====================================================

import rcToMobileRoutes from "./routes/rcToMobile.js";
import mobileToRcRoutes from "./routes/mobileToRc.js";
import vehicleRcVerificationRoutes from "./routes/vehicleRcVerification.js";
import eChallanVerificationRoutes from "./routes/eChallanVerification.js";


// =====================================================
// DL / LICENCE
// =====================================================

import learningLicenceDownloadRoutes from "./routes/learningLicenceDownload.js";
import dlVerificationPlusRoutes from "./routes/dlVerificationPlus.js";
import dlVerificationAdvanceRoutes from "./routes/dlVerificationAdvance.js";


// =====================================================
// OTHER SERVICES
// =====================================================

import eshramCardDownloadRoutes from "./routes/eshramCardDownload.js";
import uidToEshramRoutes from "./routes/uidToEshram.js";
import pincodeVerificationRoutes from "./routes/pincodeVerification.js";
import agristackStatusRoutes from "./routes/agristackStatus.js";
import ayushmanCardDownloadRoutes from "./routes/ayushmanCardDownload.js";


// =====================================================
// ADMIN / SERVICES
// =====================================================

import adminRoutes from "./routes/admin.js";
import servicesRoutes from "./routes/services.js";
import serviceUsageRoutes from "./routes/serviceUsage.js";
import serviceRequestRoutes from "./routes/serviceRequests.js";
import walletRoutes from "./routes/wallet.js";


// =====================================================
// REQUEST SERVICES
// =====================================================

import requestServicesRoutes from "./routes/requestServices.js";


// =====================================================
// PAYMENT GATEWAY
// =====================================================

import paymentRoutes from "./routes/payment.js";


// =====================================================
// APP
// =====================================================

const app = express();

const PORT = process.env.PORT || 8000;


// =====================================================
// DEBUG ENV
// =====================================================

console.log(
    "DITACORE TOKEN:",
    process.env.DITACORE_USER_TOKEN
        ? "LOADED ✅"
        : "MISSING ❌"
);

console.log(
    "DITACORE BASE URL:",
    process.env.DITACORE_BASE_URL ||
    "https://api.ditacore.com"
);


// =====================================================
// CORS
// =====================================================

app.use(
    cors({
        origin: true
    })
);


// =====================================================
// BODY PARSER
// =====================================================

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "eSeva backend is running"

        });

    }
);


// =====================================================
// AUTH
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// MAIN API ROUTES
// =====================================================

app.use(
    "/api/aadhaar",
    aadhaarRoutes
);

app.use(
    "/api/pan",
    panRoutes
);

app.use(
    "/api/rc",
    rcRoutes
);

app.use(
    "/api/dl",
    dlRoutes
);

app.use(
    "/api/ration",
    rationRoutes
);

app.use(
    "/api/farmer",
    farmerRoutes
);

app.use(
    "/api/mobile",
    mobileRoutes
);

app.use(
    "/api/npci",
    npciRoutes
);

app.use(
    "/api/up-ration",
    upRationRoutes
);

app.use(
    "/api/challan",
    challanRoutes
);

app.use(
    "/api/voter",
    voterRoutes
);

app.use(
    "/api/gst",
    gstRoutes
);

app.use(
    "/api/gst",
    gstDetailsRoutes
);

app.use(
    "/api/ifsc",
    ifscRoutes
);

app.use(
    "/api/ll",
    llRoutes
);

app.use(
    "/api/ll-status",
    llStatusRoutes
);


// =====================================================
// UID / AADHAAR
// =====================================================

app.use(
    "/api/uid-to-name",
    uidToNameRoutes
);

app.use(
    "/api/aadhaar-pan-link-check",
    aadhaarPanLinkCheckRoutes
);

app.use(
    "/api/aadhaar-data-check",
    aadhaarDataCheckRoutes
);

app.use(
    "/api/aadhaar-details",
    aadhaarDetailsRoutes
);

app.use(
    "/api/enrolment-status",
    enrolmentStatusRoutes
);

app.use(
    "/api/aadhar-verify",
    aadharVerifyRoutes
);


// =====================================================
// PAN SERVICES
// =====================================================

app.use(
    "/api/pan-to-masked-aadhaar",
    panToMaskedAadhaarRoutes
);

app.use(
    "/api/pan-to-aadhaar",
    panToAadhaarRoutes
);

app.use(
    "/api/pan-to-name",
    panToNameRoutes
);

app.use(
    "/api/pan-basic",
    panBasicRoutes
);

app.use(
    "/api/pan-prime",
    panPrimeRoutes
);

app.use(
    "/api/pan-by-gst",
    panByGstRoutes
);


// =====================================================
// VOTER SERVICES
// =====================================================

app.use(
    "/api/voter-verification",
    voterVerificationRoutes
);

app.use(
    "/api/voter-mobile-change",
    voterMobileChangeRoutes
);

app.use(
    "/api/voter-download/send-otp",
    voterDownloadSendOtpRoutes
);

app.use(
    "/api/voter-download/verify",
    voterDownloadVerifyRoutes
);

app.use(
    "/api/voter-mobile-link",
    voterMobileLinkRoutes
);


// =====================================================
// RATION SERVICES
// =====================================================

app.use(
    "/api/ration-to-uid",
    rationToUidRoutes
);

app.use(
    "/api/aadhaar-to-ration",
    aadhaarToRationRoutes
);

app.use(
    "/api/ration-basic-details",
    rationBasicDetailsRoutes
);


// =====================================================
// VEHICLE SERVICES
// =====================================================

app.use(
    "/api/rc-to-mobile",
    rcToMobileRoutes
);

app.use(
    "/api/mobile-to-rc",
    mobileToRcRoutes
);

app.use(
    "/api/vehicle-rc-verification",
    vehicleRcVerificationRoutes
);

app.use(
    "/api/e-challan",
    eChallanVerificationRoutes
);


// =====================================================
// DL / LICENCE
// =====================================================

app.use(
    "/api/learning-licence/download",
    learningLicenceDownloadRoutes
);

app.use(
    "/api/dl-verification-plus",
    dlVerificationPlusRoutes
);

app.use(
    "/api/dl-verification-advance",
    dlVerificationAdvanceRoutes
);


// =====================================================
// OTHER SERVICES
// =====================================================

app.use(
    "/api/eshram-card/download",
    eshramCardDownloadRoutes
);

app.use(
    "/api/uid-to-eshram",
    uidToEshramRoutes
);

app.use(
    "/api/pincode-verification",
    pincodeVerificationRoutes
);

app.use(
    "/api/agristack-status",
    agristackStatusRoutes
);

app.use(
    "/api/ayushman-card/download",
    ayushmanCardDownloadRoutes
);


// =====================================================
// ADMIN
// =====================================================

app.use(
    "/api/admin",
    adminRoutes
);


// =====================================================
// SERVICES
// =====================================================

app.use(
    "/api/services",
    servicesRoutes
);


// =====================================================
// SERVICE USAGE
// =====================================================

app.use(
    "/api/service-usage",
    serviceUsageRoutes
);


// =====================================================
// SERVICE REQUESTS
// =====================================================

app.use(
    "/api/service-requests",
    serviceRequestRoutes
);

app.use(
    "/api/request-services",
    requestServicesRoutes
);


// =====================================================
// WALLET
// =====================================================

app.use(
    "/api/wallet",
    walletRoutes
);


// =====================================================
// PAYMENT GATEWAY
// =====================================================

app.use(
    "/api/payment",
    paymentRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                `Route not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Server Error:",
            err
        );

        res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                err.message ||
                "Internal server error"

        });

    }
);


// =====================================================
// MONGODB CONNECTION
// =====================================================

async function connectDB() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected successfully ✅"
        );

    } catch (error) {

        console.error(
            "MongoDB connection failed ❌"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        await connectDB();

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running at http://localhost:${PORT}`
                );

                console.log(
                    `Payment API: http://localhost:${PORT}/api/payment/create-order`
                );

            }
        );

    } catch (error) {

        console.error(
            "Server startup failed ❌"
        );

        console.error(
            error
        );

        process.exit(1);

    }

}


startServer();