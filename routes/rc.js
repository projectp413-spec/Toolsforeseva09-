

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// RC PRINT
// =====================================

router.get("/print", (req, res) => {

    const {
        rcno,
        cardtype,
        chiptype
    } = req.query;


    // =================================
    // VALIDATION
    // =================================

    if (!rcno) {

        return res.status(400).json({

            success: false,

            message:
                "RC number is required"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/rc"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "rcno",
        rcno.toUpperCase()
    );


    // =================================
    // OPTIONAL PARAMETERS
    // =================================

    if (cardtype) {

        if (!["1", "2"].includes(cardtype)) {

            return res.status(400).json({

                success: false,

                message:
                    "cardtype must be 1 or 2"

            });

        }

        apiUrl.searchParams.set(
            "cardtype",
            cardtype
        );

    }


    if (chiptype) {

        if (!["1", "2"].includes(chiptype)) {

            return res.status(400).json({

                success: false,

                message:
                    "chiptype must be 1 or 2"

            });

        }

        apiUrl.searchParams.set(
            "chiptype",
            chiptype
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
                        "RC API status:",
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
                                "Invalid response from RC service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "RC API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to RC service"

            });

        }
    );

});


export default router;