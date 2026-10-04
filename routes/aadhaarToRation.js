

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { aadhaar, type } = req.query;

    if (!aadhaar) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar number is required"
        });
    }

    if (!/^\d{12}$/.test(aadhaar)) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar must be exactly 12 digits"
        });
    }

    if (!type) {
        return res.status(400).json({
            success: false,
            message: "Type is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/ration/uid_to_ration.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "aadhaar",
        aadhaar
    );

    apiUrl.searchParams.set(
        "type",
        type
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Aadhaar to Ration PDF status:",
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
            "Aadhaar to Ration PDF error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Aadhaar to Ration service"
        });
    });
});

export default router;