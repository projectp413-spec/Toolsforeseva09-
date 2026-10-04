


import express from "express";
import Service from "../models/Service.js";

const router = express.Router();


// =====================================
// GET AVAILABLE SERVICES
// =====================================

router.get("/", async (req, res) => {

    try {

        const services =
            await Service.find({
                isAvailable: true
            })
            .select(
                "name category price isAvailable"
            )
            .sort({
                category: 1,
                name: 1
            });


        return res.json({

            success: true,

            count: services.length,

            services

        });

    } catch (error) {

        console.error(
            "Get available services error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch services"

        });

    }

});


export default router;