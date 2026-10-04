
import express from "express";
import https from "https";

const router = express.Router();

router.get("/", (req, res) => {
    const { eid, captcha, captcha_txn } = req.query;

    if (!eid) {
        return res.status(400).json({
            success: false,
            message: "EID is required"
        });
    }

    if (!/^\d{28}$/.test(eid)) {
        return res.status(400).json({
            success: false,
            message: "EID must be exactly 28 digits"
        });
    }

    if (!captcha) {
        return res.status(400).json({
            success: false,
            message: "Captcha is required"
        });
    }

    if (!captcha_txn) {
        return res.status(400).json({
            success: false,
            message: "Captcha transaction ID is required"
        });
    }

    const apiUrl = new URL(
        "https://kycapizone.in/api/v2/Aadhar_Advance/enrolmentstatus.php"
    );

    apiUrl.searchParams.set(
        "api_key",
        process.env.KYC_API_KEY
    );

    apiUrl.searchParams.set(
        "eid",
        eid
    );

    apiUrl.searchParams.set(
        "captcha",
        captcha
    );

    apiUrl.searchParams.set(
        "captcha_txn",
        captcha_txn
    );

    https.get(apiUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            console.log(
                "Enrolment Status:",
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
            "Enrolment Status error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message: "Unable to connect to Enrolment Status service"
        });
    });
});

export default router;