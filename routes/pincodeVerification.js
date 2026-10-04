

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { pincode } = req.query;

    if (!pincode) {
        return res.status(400).json({
            success: false,
            message: "Pincode is required"
        });
    }

    if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({
            success: false,
            message: "Pincode must be exactly 6 digits"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/pincode/pincode_verification.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "pincode",
        pincode
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Pincode Verification status:",
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
            "Pincode Verification error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Pincode Verification service"
        });
    });
});

export default router;