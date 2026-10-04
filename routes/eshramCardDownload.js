

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { aadhaar_no, dob } = req.query;

    if (!aadhaar_no) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar number is required"
        });
    }

    if (!/^\d{12}$/.test(aadhaar_no)) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar must be exactly 12 digits"
        });
    }

    if (!dob) {
        return res.status(400).json({
            success: false,
            message: "Date of birth is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/eshram/card_download.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "aadhaar_no",
        aadhaar_no
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
                "eShram Card Download status:",
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
            "eShram Card Download error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to eShram Card service"
        });
    });
});

export default router;