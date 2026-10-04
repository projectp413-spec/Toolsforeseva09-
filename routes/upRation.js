

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// UP RATION → UID
// =====================================

router.get("/to-uid", (req, res) => {

    const { ration_no } = req.query;


    // =================================
    // VALIDATE RATION NUMBER
    // =================================

    if (!ration_no) {

        return res.status(400).json({

            success: false,

            message:
                "UP Ration card number is required"

        });

    }


    if (!/^\d{12}$/.test(ration_no)) {

        return res.status(400).json({

            success: false,

            message:
                "UP Ration card number must be exactly 12 digits"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/upration2uid"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "ration_no",
        ration_no
    );


    // =================================
    // CALL APICENTRE
    // =================================

    https.get(
        apiUrl,
        (apiRes) => {

            let data = "";


            apiRes.on(
                "data",
                (chunk) => {

                    data += chunk;

                }
            );


            apiRes.on(
                "end",
                () => {

                    console.log(
                        "UP Ration API status:",
                        apiRes.statusCode
                    );


                    try {

                        const result =
                            JSON.parse(data);


                        res
                            .status(
                                apiRes.statusCode || 200
                            )
                            .json(result);


                    } catch {

                        res.status(502).json({

                            success: false,

                            message:
                                "Invalid response from UP Ration service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "UP Ration API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to UP Ration service"

            });

        }
    );

});


export default router;