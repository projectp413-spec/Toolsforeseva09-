

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// RATION CARD PDF
// =====================================

router.get("/pdf", (req, res) => {

    const {
        rationno,
        card_type
    } = req.query;


    // =================================
    // REQUIRED PARAMETER
    // =================================

    if (!rationno) {

        return res.status(400).json({

            success: false,

            message:
                "Ration card number is required"

        });

    }


    // =================================
    // OPTIONAL CARD TYPE
    // =================================

    if (
        card_type &&
        !["1", "2"].includes(card_type)
    ) {

        return res.status(400).json({

            success: false,

            message:
                "card_type must be 1 or 2"

        });

    }


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://www.apicentre.in/api/ration_pdf/ration"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "rationno",
        rationno
    );


    // =================================
    // OPTIONAL CARD TYPE
    // =================================

    if (card_type) {

        apiUrl.searchParams.set(
            "card_type",
            card_type
        );

    }


    // =================================
    // CALL APICENTRE
    // =================================

    https.get(
        apiUrl,
        (apiRes) => {

            // PDF response hai to direct
            // binary data forward karna important hai.

            const chunks = [];

            apiRes.on(
                "data",
                (chunk) => {

                    chunks.push(chunk);

                }
            );


            apiRes.on(
                "end",
                () => {

                    const data =
                        Buffer.concat(chunks);


                    console.log(
                        "Ration API status:",
                        apiRes.statusCode
                    );


                    // Forward content type

                    if (
                        apiRes.headers[
                            "content-type"
                        ]
                    ) {

                        res.setHeader(
                            "Content-Type",
                            apiRes.headers[
                                "content-type"
                            ]
                        );

                    }


                    // Forward disposition if provided

                    if (
                        apiRes.headers[
                            "content-disposition"
                        ]
                    ) {

                        res.setHeader(
                            "Content-Disposition",
                            apiRes.headers[
                                "content-disposition"
                            ]
                        );

                    }


                    res.status(
                        apiRes.statusCode || 200
                    );


                    res.send(data);

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "Ration API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to Ration Card service"

            });

        }
    );

});


export default router;