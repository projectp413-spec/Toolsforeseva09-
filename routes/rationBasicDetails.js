

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { ration_number } = req.query;

    if (!ration_number) {
        return res.status(400).json({
            success: false,
            message: "Ration number is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/ration/ration_rc_details.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "ration_number",
        ration_number
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Ration Basic Details status:",
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
            "Ration Basic Details error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Ration Details service"
        });
    });
});

export default router;