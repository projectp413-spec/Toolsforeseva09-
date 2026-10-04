

import express from "express";
import RequestService from "../models/RequestService.js";

const router = express.Router();


// ==========================================
// GET ALL REQUEST SERVICES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const services =
            await RequestService.find({
                isAvailable: true
            })
            .select(
                "name category description price fields isAvailable"
            )
            .sort({
                category: 1,
                name: 1
            });

        return res.json({

            success: true,

            count:
                services.length,

            services

        });

    } catch (error) {

        console.error(
            "Get request services error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch request services"

        });

    }

});


// ==========================================
// GET SINGLE REQUEST SERVICE
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const service =
            await RequestService.findOne({
                _id: req.params.id,
                isAvailable: true
            });

        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Request service not found"

            });

        }

        return res.json({

            success: true,

            service

        });

    } catch (error) {

        console.error(
            "Get request service error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch request service"

        });

    }

});


export default router;