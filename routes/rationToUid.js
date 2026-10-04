

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { ration_no } = req.query;

    if (!ration_no) {
        return res.status(400).json({
            success: false,
            message: "Ration number is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/ration/ration_verifcation.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "ration_no",
        ration_no
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Ration to UID status:",
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
            "Ration to UID error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Ration service"
        });
    });
});

export default router;