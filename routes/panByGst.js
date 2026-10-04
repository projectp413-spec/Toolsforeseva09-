

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { gst } = req.query;

    if (!gst) {
        return res.status(400).json({
            success: false,
            message: "GST number is required"
        });
    }

    const gstNumber = gst.toUpperCase();

    // Basic GSTIN format validation
    if (!/^[0-9]{2}[A-Z0-9]{5}[0-9]{4}[A-Z0-9][A-Z0-9][Z][A-Z0-9]$/.test(gstNumber)) {
        return res.status(400).json({
            success: false,
            message: "Invalid GST number format"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/pan_advance/PANByGSTNo.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "gst_number",
        gstNumber
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "PAN by GST status:",
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
            "PAN by GST error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to PAN by GST service"
        });
    });
});

export default router;