

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { epic_no, mobile, signerName } = req.query;

    if (!epic_no) {
        return res.status(400).json({
            success: false,
            message: "EPIC number is required"
        });
    }

    if (!mobile) {
        return res.status(400).json({
            success: false,
            message: "Mobile number is required"
        });
    }

    if (!/^\d{10}$/.test(mobile)) {
        return res.status(400).json({
            success: false,
            message: "Mobile number must be exactly 10 digits"
        });
    }

    if (!signerName) {
        return res.status(400).json({
            success: false,
            message: "Signer name is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/voter/voter_change_mob.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "epic_no",
        epic_no.toUpperCase()
    );

    apiUrl.searchParams.set(
        "mobile",
        mobile
    );

    apiUrl.searchParams.set(
        "signerName",
        signerName
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Voter Mobile Change status:",
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
            "Voter Mobile Change error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Voter Mobile Change service"
        });
    });
});

export default router;