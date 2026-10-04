

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// FARMER / KISAN DETAILS
// =====================================

router.get("/details", (req, res) => {

    const {
        aadhaar,
        state
    } = req.query;


    // =================================
    // VALIDATE AADHAAR
    // =================================

    if (!aadhaar) {

        return res.status(400).json({

            success: false,

            message:
                "Aadhaar number is required"

        });

    }


    if (!/^\d{12}$/.test(aadhaar)) {

        return res.status(400).json({

            success: false,

            message:
                "Aadhaar must be exactly 12 digits"

        });

    }


    // =================================
    // VALIDATE STATE
    // =================================

    if (!state) {

        return res.status(400).json({

            success: false,

            message:
                "State code is required"

        });

    }


    const stateCode =
        state.trim().toUpperCase();


    // State code should be 2 letters

    if (!/^[A-Z]{2}$/.test(stateCode)) {

        return res.status(400).json({

            success: false,

            message:
                "State code must contain 2 letters"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/farmer"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "aadhaar",
        aadhaar
    );


    apiUrl.searchParams.set(
        "state",
        stateCode
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
                        "Farmer API status:",
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
                                "Invalid response from Farmer service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "Farmer API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to Farmer service"

            });

        }
    );

});


export default router;