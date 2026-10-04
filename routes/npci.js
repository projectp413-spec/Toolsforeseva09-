

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// NPCI STATUS
// =====================================

router.get("/status", (req, res) => {

    const { aadhaar } = req.query;


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
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/npci_status"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "aadhaar",
        aadhaar
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
                        "NPCI API status:",
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
                                "Invalid response from NPCI service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "NPCI API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to NPCI service"

            });

        }
    );

});


export default router;