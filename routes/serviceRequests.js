

import express from "express";
import mongoose from "mongoose";

import RequestService from "../models/RequestService.js";
import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ======================================================
// CREATE SERVICE REQUEST
// ======================================================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            serviceId,
            requestData
        } = req.body;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!serviceId) {

            return res.status(400).json({

                success: false,

                message:
                    "Service ID is required"

            });

        }


        if (
            !requestData ||
            typeof requestData !== "object"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Request data is required"

            });

        }


        // ==================================================
        // FIND REQUEST SERVICE
        // ==================================================

        const service =
            await RequestService.findOne({

                _id: serviceId,

                isAvailable: true

            });


        if (!service) {

            return res.status(404).json({

                success: false,

                message:
                    "Request service not found or unavailable"

            });

        }


        // ==================================================
        // FIND USER
        // ==================================================

        const user =
            await User.findById(userId);


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // ==================================================
        // BLOCKED USER
        // ==================================================

        if (user.isBlocked) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account has been blocked"

            });

        }


        // ==================================================
        // WALLET CHECK
        // ==================================================
        // Uses the same live Wallet collection that the
        // payment gateway (DITACORE) credits, so a recharge
        // is reflected here immediately, not the legacy
        // User.walletBalance field.
        // ==================================================

        const price =
            Number(service.price || 0);


        let wallet =
            await Wallet.findOne({
                user: userId
            });


        if (!wallet) {

            wallet =
                await Wallet.create({

                    user: userId,

                    balance: 0

                });

        }


        if (wallet.balance < price) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient wallet balance",

                requiredAmount:
                    price,

                walletBalance:
                    wallet.balance

            });

        }


        // ==================================================
        // DEDUCT WALLET
        // ==================================================

        const balanceBefore =
            wallet.balance;

        wallet.balance =
            Number(
                (
                    wallet.balance -
                    price
                ).toFixed(2)
            );

        await wallet.save();


        await WalletTransaction.create({

            user: userId,

            type: "DEBIT",

            amount: price,

            balanceBefore,

            balanceAfter:
                wallet.balance,

            reason:
                `Request Service: ${service.name}`,

            status: "SUCCESS"

        });


        // ==================================================
        // CREATE REQUEST
        // ==================================================

        const request =
            await ServiceRequest.create({

                user: userId,

                service:
                    service._id,

                serviceName:
                    service.name,

                category:
                    service.category,

                requestData,

                amount:
                    price,

                status:
                    "Pending"

            });


        // ==================================================
        // SUCCESS
        // ==================================================

        return res.status(201).json({

            success: true,

            message:
                "Service request submitted successfully",

            request: {

                id:
                    request._id,

                serviceId:
                    service._id,

                serviceName:
                    request.serviceName,

                category:
                    request.category,

                amount:
                    request.amount,

                status:
                    request.status,

                requestData:
                    request.requestData,

                createdAt:
                    request.createdAt

            },

            walletBalance:
                wallet.balance

        });


    } catch (error) {

        console.error(
            "Create service request error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create service request"

        });

    }

});


// ======================================================
// USER - MY REQUESTS
// ======================================================

router.get(
    "/my",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                req.user.id;


            const requests =
                await ServiceRequest.find({

                    user: userId

                })

                .populate(
                    "service",
                    "name category price description fields"
                )

                .sort({
                    createdAt: -1
                });


            return res.json({

                success: true,

                count:
                    requests.length,

                requests

            });


        } catch (error) {

            console.error(
                "Get my requests error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch requests"

            });

        }

    }
);


// ======================================================
// USER - SINGLE REQUEST
// ======================================================

router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                req.user.id;

            const requestId =
                req.params.id;


            // ==================================================
            // VALIDATE ID
            // ==================================================

            if (
                !mongoose.Types.ObjectId.isValid(
                    requestId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid request ID"

                });

            }


            const request =
                await ServiceRequest.findOne({

                    _id:
                        requestId,

                    user:
                        userId

                })

                .populate(
                    "service",
                    "name category price description fields"
                );


            if (!request) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Request not found"

                });

            }


            return res.json({

                success: true,

                request

            });


        } catch (error) {

            console.error(
                "Get request error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch request"

            });

        }

    }
);


// ======================================================
// ADMIN - GET ALL REQUESTS
// ======================================================

router.get(
    "/admin/all",
    authMiddleware,
    async (req, res) => {

        try {

            // ==================================================
            // ADMIN CHECK
            // ==================================================

            if (
                req.user.role !==
                "admin"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Admin access required"

                });

            }


            const requests =
                await ServiceRequest.find()

                .populate(
                    "user",
                    "name email"
                )

                .populate(
                    "service",
                    "name category price description fields"
                )

                .sort({
                    createdAt: -1
                });


            return res.json({

                success: true,

                count:
                    requests.length,

                requests

            });


        } catch (error) {

            console.error(
                "Admin get requests error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch requests"

            });

        }

    }
);


// ======================================================
// ADMIN - UPDATE REQUEST
// ======================================================

router.patch(
    "/admin/:id",
    authMiddleware,
    async (req, res) => {

        try {

            // ==================================================
            // ADMIN CHECK
            // ==================================================

            if (
                req.user.role !==
                "admin"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Admin access required"

                });

            }


            const requestId =
                req.params.id;


            // ==================================================
            // VALIDATE ID
            // ==================================================

            if (
                !mongoose.Types.ObjectId.isValid(
                    requestId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid request ID"

                });

            }


            const {
                status,
                adminRemark,
                result
            } = req.body;


            // ==================================================
            // VALIDATE STATUS
            // ==================================================

            const allowedStatuses = [

                "Pending",

                "Processing",

                "Success",

                "Failed"

            ];


            if (
                status &&
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid status"

                });

            }


            // ==================================================
            // FIND REQUEST
            // ==================================================

            const request =
                await ServiceRequest.findById(
                    requestId
                );


            if (!request) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Request not found"

                });

            }


            // ==================================================
            // UPDATE
            // ==================================================

            if (
                status !== undefined
            ) {

                request.status =
                    status;

            }


            if (
                adminRemark !== undefined
            ) {

                request.adminRemark =
                    adminRemark;

            }


            if (
                result !== undefined
            ) {

                request.result =
                    result;

            }


            await request.save();


            // ==================================================
            // RETURN UPDATED REQUEST
            // ==================================================

            const updatedRequest =
                await ServiceRequest.findById(
                    request._id
                )

                .populate(
                    "user",
                    "name email"
                )

                .populate(
                    "service",
                    "name category price"
                );


            return res.json({

                success: true,

                message:
                    "Request updated successfully",

                request:
                    updatedRequest

            });

        } catch (error) {

            console.error(
                "Admin update request error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update request"

            });

        }

    }
);


export default router;