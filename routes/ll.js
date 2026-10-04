

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// LEARNER LICENCE EXAM
// =====================================

router.get("/exam", (req, res) => {

    const {
        appno,
        password,
        dob
    } = req.query;


    // =================================
    // VALIDATION
    // =================================

    if (!appno) {

        return res.status(400).json({
            success: false,
            message: "Application number is required"
        });

    }

    if (!password) {

        return res.status(400).json({
            success: false,
            message: "Application password is required"
        });

    }

    if (!dob) {

        return res.status(400).json({
            success: false,
            message: "Date of birth is required"
        });

    }


    // DD-MM-YYYY

    if (!/^\d{2}-\d{2}-\d{4}$/.test(dob)) {

        return res.status(400).json({
            success: false,
            message: "DOB must be in DD-MM-YYYY format"
        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/ll_exam"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );

    apiUrl.searchParams.set(
        "appno",
        appno.trim()
    );

    apiUrl.searchParams.set(
        "password",
        password
    );

    apiUrl.searchParams.set(
        "dob",
        dob
    );


    // =================================
    // CALL APICENTRE
    // =================================

    https.get(apiUrl, (apiRes) => {

        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {

            console.log(
                "LL Exam API status:",
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
                    message:
                        "Invalid response from Learner Licence service"
                });

            }

        });

    }).on("error", (error) => {

        console.error(
            "LL Exam API error:",
            error.message
        );

        res.status(502).json({
            success: false,
            message:
                "Unable to connect to Learner Licence service"
        });

    });

});


export default router;