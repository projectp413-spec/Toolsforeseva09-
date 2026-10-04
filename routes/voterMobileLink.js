

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { voter_number, mobile_number } = req.query;

    if (!voter_number) {
        return res.status(400).json({
            success: false,
            message: "Voter number is required"
        });
    }

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
        "https://kycapizone.in/api/v3/voter/voter_mobile_link.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "voter_number",
        voter_number.toUpperCase()
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
                "Voter Mobile Link status:",
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
            "Voter Mobile Link error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Voter Mobile Link service"
        });
    });
});

export default router;