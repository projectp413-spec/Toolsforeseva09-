

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { reg_number } = req.query;

    if (!reg_number) {
        return res.status(400).json({
            success: false,
            message: "Vehicle registration number is required"
        });
    }

    const registrationNumber = reg_number
        .toUpperCase()
        .replace(/\s+/g, "");

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/vechile/mobile-no.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "reg_number",
        registrationNumber
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "RC to Mobile status:",
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
            "RC to Mobile error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to RC to Mobile service"
        });
    });
});

export default router;