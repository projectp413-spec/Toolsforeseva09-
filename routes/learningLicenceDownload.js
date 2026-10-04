

import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { id_number } = req.query;

    if (!id_number) {
        return res.status(400).json({
            success: false,
            message: "ID number is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v3/vechile/LL_application_pdf.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "id_number",
        id_number
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Learning Licence Download status:",
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
            "Learning Licence Download error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Learning Licence service"
        });
    });
});

export default router;