

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// PAN DETAILS
// =====================================

router.get("/details", (req, res) => {

    const panno = req.query.panno;


    // =================================
    // VALIDATION
    // =================================

    if (!panno) {

        return res.status(400).json({

            success: false,

            message:
                "PAN number is required"

        });

    }


    // PAN format validation
    // Example: CFAPR3702R

    if (
        !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
            panno.toUpperCase()
        )
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid PAN number format"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/pan_details"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "panno",
        panno.toUpperCase()
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
                        "PAN API status:",
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
                                "Invalid response from PAN service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "PAN API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to PAN service"

            });

        }
    );

});


export default router;