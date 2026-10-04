

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// IFSC → BANK BRANCH DETAILS
// =====================================

router.get("/details", (req, res) => {

    const { ifsc } = req.query;


    // =================================
    // VALIDATE IFSC
    // =================================

    if (!ifsc) {

        return res.status(400).json({

            success: false,

            message: "IFSC code is required"

        });

    }


    const ifscCode =
        ifsc.trim().toUpperCase();


    // Standard IFSC format:
    // 4 letters + 0 + 6 alphanumeric characters

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {

        return res.status(400).json({

            success: false,

            message: "Invalid IFSC code format"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/ifsc_details"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "ifsc",
        ifscCode
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
                        "IFSC API status:",
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
                                "Invalid response from IFSC service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "IFSC API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to IFSC service"

            });

        }
    );

});


export default router;