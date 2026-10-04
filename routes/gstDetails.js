
import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// GSTIN → GST DETAILS
// =====================================

router.get("/details", (req, res) => {

    const { gst } = req.query;


    // =================================
    // VALIDATE GSTIN
    // =================================

    if (!gst) {

        return res.status(400).json({

            success: false,

            message: "GSTIN is required"

        });

    }


    const gstNumber =
        gst.trim().toUpperCase();


    // GSTIN = 15 characters
    // Standard GSTIN structure

    if (
        !/^[0-9]{2}[A-Z0-9]{13}$/.test(gstNumber)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Invalid GSTIN format"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/gst_details"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "gst",
        gstNumber
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
                        "GST Details API status:",
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
                                "Invalid response from GST Details service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "GST Details API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to GST Details service"

            });

        }
    );

});


export default router;