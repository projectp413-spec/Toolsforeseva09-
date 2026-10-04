

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// MOBILE → PAN
// =====================================

router.get("/to-pan", (req, res) => {

    const {
        Name,
        MobileNo
    } = req.query;


    // =================================
    // VALIDATE NAME
    // =================================

    if (!Name) {

        return res.status(400).json({

            success: false,

            message:
                "Customer name is required"

        });

    }


    // =================================
    // VALIDATE MOBILE
    // =================================

    if (!MobileNo) {

        return res.status(400).json({

            success: false,

            message:
                "Mobile number is required"

        });

    }


    if (!/^\d{10}$/.test(MobileNo)) {

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
        "https://www.apicentre.in/api/mobile_to_pan"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "Name",
        Name.trim()
    );


    apiUrl.searchParams.set(
        "MobileNo",
        MobileNo
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
                        "Mobile → PAN API status:",
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
                                "Invalid response from Mobile → PAN service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "Mobile → PAN API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to Mobile → PAN service"

            });

        }
    );

});


export default router;