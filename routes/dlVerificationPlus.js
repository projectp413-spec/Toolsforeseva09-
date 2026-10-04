

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { license_number, dob } = req.query;

    if (!license_number) {
        return res.status(400).json({
            success: false,
            message: "License number is required"
        });
    }

    if (!dob) {
        return res.status(400).json({
            success: false,
            message: "Date of birth is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/vechile/driving-plus.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "license_number",
        license_number.toUpperCase()
    );

    apiUrl.searchParams.set(
        "dob",
        dob
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "DL Verification Plus status:",
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
            "DL Verification Plus error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to DL Verification service"
        });
    });
});

export default router;