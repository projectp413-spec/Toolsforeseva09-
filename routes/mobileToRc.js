

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { mobile_number } = req.query;

    if (!mobile_number) {
        return res.status(400).json({
            success: false,
            message: "Mobile number is required"
        });
    }

    if (!/^\d{10}$/.test(mobile_number)) {
        return res.status(400).json({
            success: false,
            message: "Mobile number must be exactly 10 digits"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/vechile/mobile-to-reg.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "mobile_number",
        mobile_number
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Mobile to RC status:",
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
            "Mobile to RC error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Mobile to RC service"
        });
    });
});

export default router;