

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { uid, captcha, captcha_txn } = req.query;

    if (!uid) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar number is required"
        });
    }

    if (!/^\d{12}$/.test(uid)) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar must be exactly 12 digits"
        });
    }

    if (!captcha) {
        return res.status(400).json({
            success: false,
            message: "Captcha is required"
        });
    }

    if (!captcha_txn) {
        return res.status(400).json({
            success: false,
            message: "Captcha transaction ID is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/Aadhar_Advance/verifyUid.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "uid",
        uid
    );

    apiUrl.searchParams.set(
        "captcha",
        captcha
    );

    apiUrl.searchParams.set(
        "captcha_txn",
        captcha_txn
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Aadhaar Verify status:",
                apiRes.statusCode
            );

            try {
                const result = JSON.parse(data);

                res
                    .status(apiRes.statusCode || 200)
                    .json(result);

            } catch {
                res.status(502).json({
                    success: false,
                    message: "Invalid response from KYC API"
                });
            }
        });

    }).on("error", (error) => {
        console.error(
            "Aadhaar Verify error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Aadhaar Verify service"
        });
    });
});

export default router;