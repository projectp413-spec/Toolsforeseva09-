

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// VOTER EPIC → MOBILE LINK
// =====================================

router.get("/link-mobile", (req, res) => {

    const {
        epic,
        mobile
    } = req.query;


    // =================================
    // VALIDATE EPIC
    // =================================

    if (!epic) {

        return res.status(400).json({

            success: false,

            message:
                "Voter EPIC number is required"

        });

    }


    // =================================
    // VALIDATE MOBILE
    // =================================

    if (!mobile) {

        return res.status(400).json({

            success: false,

            message:
                "Mobile number is required"

        });

    }


    if (!/^\d{10}$/.test(mobile)) {

        return res.status(400).json({

            success: false,

            message:
                "Mobile number must be exactly 10 digits"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/voter_link_instent"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "epic",
        epic.trim().toUpperCase()
    );


    apiUrl.searchParams.set(
        "mobile",
        mobile
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
                        "Voter Link API status:",
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
                                "Invalid response from Voter service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "Voter Link API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to Voter service"

            });

        }
    );

});


export default router;