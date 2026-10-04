

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { license_number } = req.query;

    if (!license_number) {
        return res.status(400).json({
            success: false,
            message: "License number is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/vechile/driving-licenses.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "license_number",
        license_number.toUpperCase()
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "DL Verification Advance status:",
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
            "DL Verification Advance error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to DL Verification Advance service"
        });
    });
});

export default router;