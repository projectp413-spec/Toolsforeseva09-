

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { rc_number } = req.query;

    if (!rc_number) {
        return res.status(400).json({
            success: false,
            message: "RC number is required"
        });
    }

    const rcNumber = rc_number
        .toUpperCase()
        .replace(/\s+/g, "");

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/dl/chalancheck.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "rc_number",
        rcNumber
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "E-Challan Verification status:",
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
            "E-Challan Verification error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to E-Challan service"
        });
    });
});

export default router;