

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// PAN → GST
// =====================================

router.get("/by-pan", (req, res) => {

    const { pan } = req.query;


    // =================================
    // VALIDATE PAN
    // =================================

    if (!pan) {

        return res.status(400).json({

            success: false,

            message: "PAN number is required"

        });

    }


    const panNumber =
        pan.trim().toUpperCase();


    // Standard PAN format:
    // 5 letters + 4 digits + 1 letter

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {

        return res.status(400).json({

            success: false,

            message: "Invalid PAN number format"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/pan_to_gst"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );

    apiUrl.searchParams.set(
        "pan",
        panNumber
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
                        "PAN → GST API status:",
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
                                "Invalid response from PAN → GST service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "PAN → GST API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to PAN → GST service"

            });

        }
    );

});


export default router;