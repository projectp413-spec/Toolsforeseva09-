

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { pan } = req.query;

    if (!pan) {
        return res.status(400).json({
            success: false,
            message: "PAN number is required"
        });
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase())) {
        return res.status(400).json({
            success: false,
            message: "Invalid PAN format"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/pan/pantomaskuid.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "pan",
        pan.toUpperCase()
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "PAN to Masked Aadhaar status:",
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
            "PAN to Masked Aadhaar error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to PAN service"
        });
    });
});

export default router;