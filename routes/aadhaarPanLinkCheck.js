

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const aadhaar = req.query.aadhaar;

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

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/pan_advance/aadharverify.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "aadhaar_no",
        aadhaar
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Aadhaar-PAN Link Check status:",
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
            "Aadhaar-PAN Link Check error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Aadhaar-PAN service"
        });
    });
});

export default router;