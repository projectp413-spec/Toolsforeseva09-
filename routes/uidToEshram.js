

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar number is required"
        });
    }

    if (!/^\d{12}$/.test(uid)) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar must be exactly 12 digits"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/eshram/get_aadhaar_by_uan.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "uid",
        uid
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "UID to eShram status:",
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
            "UID to eShram error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to UID to eShram service"
        });
    });
});

export default router;