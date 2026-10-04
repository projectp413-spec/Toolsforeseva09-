

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { rc_no } = req.query;

    if (!rc_no) {
        return res.status(400).json({
            success: false,
            message: "RC number is required"
        });
    }

    const rcNumber = rc_no
        .toUpperCase()
        .replace(/\s+/g, "");

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/vechile/vehicles.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "rc_no",
        rcNumber
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Vehicle RC Verification status:",
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
            "Vehicle RC Verification error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Vehicle RC Verification service"
        });
    });
});

export default router;


