

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// DRIVING LICENCE
// =====================================

router.get("/details", (req, res) => {

    const {
        dlno,
        dob,
        cardtype,
        state
    } = req.query;


    // =================================
    // REQUIRED PARAMETERS
    // =================================

    if (!dlno) {

        return res.status(400).json({

            success: false,

            message:
                "Driving Licence number is required"

        });

    }


    if (!dob) {

        return res.status(400).json({

            success: false,

            message:
                "Date of birth is required"

        });

    }


    // =================================
    // DOB VALIDATION
    // DD-MM-YYYY
    // =================================

    if (
        !/^\d{2}-\d{2}-\d{4}$/.test(dob)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "DOB must be in DD-MM-YYYY format"

        });

    }


    // =================================
    // OPTIONAL CARD TYPE
    // =================================

    if (
        cardtype &&
        !["1", "2"].includes(cardtype)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "cardtype must be 1 or 2"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/dl"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "dlno",
        dlno.toUpperCase()
    );


    apiUrl.searchParams.set(
        "dob",
        dob
    );


    // =================================
    // OPTIONAL PARAMETERS
    // =================================

    if (cardtype) {

        apiUrl.searchParams.set(
            "cardtype",
            cardtype
        );

    }


    if (state) {

        apiUrl.searchParams.set(
            "state",
            state.toUpperCase()
        );

    }


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
                        "DL API status:",
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
                                "Invalid response from DL service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "DL API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to DL service"

            });

        }
    );

});


export default router;