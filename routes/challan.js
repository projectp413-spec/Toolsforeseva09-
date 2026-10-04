

import express from "express";
import https from "https";

const router = express.Router();


// =====================================
// VEHICLE CHALLAN
// =====================================

router.get("/details", (req, res) => {

    const { vehicle_number } = req.query;


    // =================================
    // VALIDATION
    // =================================

    if (!vehicle_number) {

        return res.status(400).json({

            success: false,

            message:
                "Vehicle registration number is required"

        });

    }


    const vehicleNumber =
        vehicle_number
            .trim()
            .toUpperCase();


    // =================================
    // APICENTRE URL
    // =================================

    const apiUrl = new URL(
        "https://apicentre.in/api/vehicle_challan"
    );


    apiUrl.searchParams.set(
        "api_key",
        process.env.APICENTRE_API_KEY
    );


    apiUrl.searchParams.set(
        "vehicle_number",
        vehicleNumber
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
                        "Vehicle Challan API status:",
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
                                "Invalid response from Vehicle Challan service"

                        });

                    }

                }
            );

        }

    ).on(
        "error",
        (error) => {

            console.error(
                "Vehicle Challan API error:",
                error.message
            );


            res.status(502).json({

                success: false,

                message:
                    "Unable to connect to Vehicle Challan service"

            });

        }
    );

});


export default router;