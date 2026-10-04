

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// LEARNER LICENCE EXAM STATUS
// =====================================

router.get("/status", (req, res) => {

    const { order_id } = req.query;


    // =================================
    // VALIDATION
    // =================================

    if (!order_id) {

        return res.status(400).json({

            success: false,

            message: "Order ID is required"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/ll_exam_status"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );

    apiUrl.searchParams.set(
        "order_id",
        order_id.trim()
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
                "LL Status API status:",
                apiRes.statusCode
            );


            try {

                const result =
                    JSON.parse(data);


                res
                    .status(apiRes.statusCode || 200)
                    .json(result);


            } catch {

                res.status(502).json({

                    success: false,

                    message:
                        "Invalid response from LL Status service"

                });

            }

        });

    }).on("error", (error) => {

        console.error(
            "LL Status API error:",
            error.message
        );


        res.status(502).json({

            success: false,

            message:
                "Unable to connect to LL Status service"

        });

    });

});


export default router;