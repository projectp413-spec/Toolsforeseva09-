

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { epic_no } = req.query;

    if (!epic_no) {
        return res.status(400).json({
            success: false,
            message: "EPIC number is required"
        });
    }

    const epicNumber = epic_no.toUpperCase();

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/voter/down_voter_send_otp.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "epic_no",
        epicNumber
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Voter Download Send OTP status:",
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
            "Voter Download Send OTP error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Voter Download service"
        });
    });
});

export default router;