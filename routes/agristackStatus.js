


import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { id_type, id } = req.query;

    if (!id_type) {
        return res.status(400).json({
            success: false,
            message: "ID type is required"
        });
    }

    const allowedTypes = [
        "uid",
        "centralid",
        "enrollmentnumber"
    ];

    if (!allowedTypes.includes(id_type.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID type"
        });
    }

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "ID is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/farmer/farmer_approvel.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "id_type",
        id_type.toLowerCase()
    );

    apiUrl.searchParams.set(
        "id",
        id
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Agristack Status:",
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
            "Agristack Status error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Agristack service"
        });
    });
});

export default router;