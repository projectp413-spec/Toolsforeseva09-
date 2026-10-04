


// import express from "express";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";
// import Service from "../models/Service.js";
// import ServiceUsage from "../models/ServiceUsage.js";

// const router = express.Router();


// // =====================================
// // AUTHENTICATE USER
// // =====================================

// async function authenticateUser(req, res, next) {

//     try {

//         const authHeader =
//             req.headers.authorization;


//         if (
//             !authHeader ||
//             !authHeader.startsWith("Bearer ")
//         ) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "Authentication token required"

//             });

//         }


//         const token =
//             authHeader.split(" ")[1];


//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );


//         const user =
//             await User.findById(
//                 decoded.userId
//             );


//         if (!user) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "User not found"

//             });

//         }


//         if (user.isBlocked) {

//             return res.status(403).json({

//                 success: false,

//                 message:
//                     "Your account has been blocked by admin"

//             });

//         }


//         req.user = user;

//         next();


//     } catch (error) {

//         console.error(
//             "Authentication error:",
//             error.message
//         );


//         return res.status(401).json({

//             success: false,

//             message:
//                 "Invalid or expired token"

//         });

//     }

// }


// // =====================================
// // RECORD SERVICE USAGE
// // =====================================

// router.post(
//     "/",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             const {
//                 serviceId,
//                 status = "success"
//             } = req.body;


//             if (!serviceId) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Service ID is required"

//                 });

//             }


//             // =====================================
//             // FIND SERVICE
//             // =====================================

//             const service =
//                 await Service.findById(
//                     serviceId
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             if (!service.isAvailable) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Service is currently unavailable"

//                 });

//             }


//             // =====================================
//             // SAVE USAGE
//             // =====================================

//             const usage =
//                 await ServiceUsage.create({

//                     user:
//                         req.user._id,

//                     service:
//                         service._id,

//                     serviceName:
//                         service.name,

//                     charge:
//                         service.price,

//                     status:
//                         status === "failed"
//                             ? "failed"
//                             : "success"

//                 });


//             return res.status(201).json({

//                 success: true,

//                 message:
//                     "Service usage recorded successfully",

//                 usage

//             });


//         } catch (error) {

//             console.error(
//                 "Record service usage error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to record service usage"

//             });

//         }

//     }
// );


// export default router;



// import express from "express";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";
// import Service from "../models/Service.js";
// import ServiceUsage from "../models/ServiceUsage.js";

// const router = express.Router();


// // =====================================
// // AUTHENTICATE USER
// // =====================================

// async function authenticateUser(req, res, next) {

//     try {

//         const authHeader =
//             req.headers.authorization;


//         if (
//             !authHeader ||
//             !authHeader.startsWith("Bearer ")
//         ) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "Authentication token required"

//             });

//         }


//         const token =
//             authHeader.split(" ")[1];


//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );


//         const user =
//             await User.findById(
//                 decoded.userId
//             );


//         if (!user) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "User not found"

//             });

//         }


//         // Blocked user cannot access history
//         if (user.isBlocked) {

//             return res.status(403).json({

//                 success: false,

//                 message:
//                     "Your account has been blocked by admin"

//             });

//         }


//         req.user = user;

//         next();


//     } catch (error) {

//         console.error(
//             "Authentication error:",
//             error.message
//         );


//         return res.status(401).json({

//             success: false,

//             message:
//                 "Invalid or expired token"

//         });

//     }

// }


// // =====================================
// // RECORD SERVICE USAGE
// // =====================================

// router.post(
//     "/",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             const {
//                 serviceId,
//                 status = "success"
//             } = req.body;


//             if (!serviceId) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Service ID is required"

//                 });

//             }


//             // =====================================
//             // FIND SERVICE
//             // =====================================

//             const service =
//                 await Service.findById(
//                     serviceId
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             // =====================================
//             // SAVE USAGE
//             // =====================================

//             const usage =
//                 await ServiceUsage.create({

//                     user:
//                         req.user._id,

//                     service:
//                         service._id,

//                     serviceName:
//                         service.name,

//                     charge:
//                         service.price,

//                     status:
//                         status === "failed"
//                             ? "failed"
//                             : "success",

//                     comment:
//                         ""

//                 });


//             return res.status(201).json({

//                 success: true,

//                 message:
//                     "Service usage recorded successfully",

//                 usage

//             });


//         } catch (error) {

//             console.error(
//                 "Record service usage error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to record service usage"

//             });

//         }

//     }
// );


// // =====================================
// // GET MY APPLIED HISTORY
// // =====================================

// router.get(
//     "/my-history",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             const history =
//                 await ServiceUsage.find({
//                     user: req.user._id
//                 })
//                 .select(
//                     "serviceName charge status comment createdAt"
//                 )
//                 .sort({
//                     createdAt: -1
//                 });


//             return res.json({

//                 success: true,

//                 count:
//                     history.length,

//                 history

//             });


//         } catch (error) {

//             console.error(
//                 "User service history error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch service history"

//             });

//         }

//     }
// );


// export default router;


// import express from "express";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";
// import Service from "../models/Service.js";
// import ServiceUsage from "../models/ServiceUsage.js";
// import Wallet from "../models/Wallet.js";
// import WalletTransaction from "../models/WalletTransaction.js";

// const router = express.Router();


// // =====================================
// // AUTHENTICATE USER
// // =====================================

// async function authenticateUser(req, res, next) {

//     try {

//         const authHeader =
//             req.headers.authorization;

//         if (
//             !authHeader ||
//             !authHeader.startsWith("Bearer ")
//         ) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "Authentication token required"

//             });

//         }

//         const token =
//             authHeader.split(" ")[1];

//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );

//         const user =
//             await User.findById(
//                 decoded.userId
//             );

//         if (!user) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "User not found"

//             });

//         }

//         if (user.isBlocked) {

//             return res.status(403).json({

//                 success: false,

//                 message:
//                     "Your account has been blocked by admin"

//             });

//         }

//         req.user = user;

//         next();

//     } catch (error) {

//         console.error(
//             "Authentication error:",
//             error.message
//         );

//         return res.status(401).json({

//             success: false,

//             message:
//                 "Invalid or expired token"

//         });

//     }

// }


// // =====================================
// // RECORD SERVICE USAGE + WALLET DEBIT
// // =====================================

// router.post(
//     "/",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             const {
//                 serviceId,
//                 status = "success"
//             } = req.body;


//             // =====================================
//             // SERVICE ID CHECK
//             // =====================================

//             if (!serviceId) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Service ID is required"

//                 });

//             }


//             // =====================================
//             // FIND SERVICE
//             // =====================================

//             const service =
//                 await Service.findById(
//                     serviceId
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             // =====================================
//             // CHECK SERVICE AVAILABILITY
//             // =====================================

//             if (!service.isAvailable) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "This service is currently unavailable"

//                 });

//             }


//             // =====================================
//             // FIND USER WALLET
//             // =====================================

//             let wallet =
//                 await Wallet.findOne({

//                     user:
//                         req.user._id

//                 });


//             // Wallet doesn't exist
//             if (!wallet) {

//                 wallet =
//                     await Wallet.create({

//                         user:
//                             req.user._id,

//                         balance: 0

//                     });

//             }


//             // =====================================
//             // SERVICE PRICE
//             // =====================================

//             const charge =
//                 Number(service.price);


//             // =====================================
//             // CHECK BALANCE
//             // =====================================

//             if (wallet.balance < charge) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Insufficient wallet balance",

//                     requiredAmount:
//                         charge,

//                     walletBalance:
//                         wallet.balance

//                 });

//             }


//             // =====================================
//             // IMPORTANT:
//             // DON'T CHARGE IF SERVICE FAILED
//             // =====================================

//             const requestedStatus =
//                 status === "failed"
//                     ? "failed"
//                     : "success";


//             // =====================================
//             // DEDUCT WALLET
//             // =====================================

//             const balanceBefore =
//                 wallet.balance;


//             wallet.balance =
//                 wallet.balance - charge;


//             await wallet.save();


//             // =====================================
//             // CREATE WALLET TRANSACTION
//             // =====================================

//             const walletTransaction =
//                 await WalletTransaction.create({

//                     user:
//                         req.user._id,

//                     type:
//                         "DEBIT",

//                     amount:
//                         charge,

//                     balanceBefore:
//                         balanceBefore,

//                     balanceAfter:
//                         wallet.balance,

//                     reason:
//                         service.name,

//                     status:
//                         "SUCCESS"

//                 });


//             // =====================================
//             // SAVE SERVICE USAGE
//             // =====================================

//             const usage =
//                 await ServiceUsage.create({

//                     user:
//                         req.user._id,

//                     service:
//                         service._id,

//                     serviceName:
//                         service.name,

//                     charge:
//                         charge,

//                     status:
//                         requestedStatus,

//                     comment:
//                         ""

//                 });


//             // =====================================
//             // SUCCESS RESPONSE
//             // =====================================

//             return res.status(201).json({

//                 success: true,

//                 message:
//                     "Service usage recorded and wallet debited successfully",

//                 usage,

//                 wallet: {

//                     balance:
//                         wallet.balance

//                 },

//                 transaction:
//                     walletTransaction

//             });


//         } catch (error) {

//             console.error(
//                 "Record service usage error:",
//                 error
//             );

//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to record service usage"

//             });

//         }

//     }
// );


// // =====================================
// // GET MY APPLIED HISTORY
// // =====================================

// router.get(
//     "/my-history",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             const history =
//                 await ServiceUsage.find({

//                     user:
//                         req.user._id

//                 })
//                 .select(
//                     "serviceName charge status comment createdAt"
//                 )
//                 .sort({

//                     createdAt: -1

//                 });


//             return res.json({

//                 success: true,

//                 count:
//                     history.length,

//                 history

//             });


//         } catch (error) {

//             console.error(
//                 "User service history error:",
//                 error
//             );

//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch service history"

//             });

//         }

//     }
// );


// export default router;






import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Service from "../models/Service.js";
import ServiceUsage from "../models/ServiceUsage.js";
import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";

const router = express.Router();


// =====================================
// AUTHENTICATE USER
// =====================================

async function authenticateUser(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token required"

            });

        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        const userId =
            decoded.userId ||
            decoded.id ||
            decoded._id;

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid authentication token"

            });

        }

        const user =
            await User.findById(userId);

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "User not found"

            });

        }

        if (user.isBlocked) {

            return res.status(403).json({

                success: false,

                message:
                    "Your account has been blocked by admin"

            });

        }

        req.user = user;

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"

        });

    }

}


// =====================================
// RECORD SERVICE USAGE + WALLET DEBIT
// =====================================

router.post(
    "/",
    authenticateUser,
    async (req, res) => {

        try {

            const {
                serviceId,
                status = "success",
                comment = ""
            } = req.body;


            // =====================================
            // SERVICE ID CHECK
            // =====================================

            if (!serviceId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Service ID is required"

                });

            }


            // =====================================
            // FIND SERVICE
            // =====================================

            const service =
                await Service.findById(
                    serviceId
                );

            if (!service) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service not found"

                });

            }


            // =====================================
            // CHECK SERVICE AVAILABILITY
            // =====================================

            if (!service.isAvailable) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This service is currently unavailable"

                });

            }


            // =====================================
            // SERVICE STATUS
            // =====================================

            const requestedStatus =
                String(status).toLowerCase() === "failed"
                    ? "failed"
                    : "success";


            // =====================================
            // IMPORTANT
            // FAILED SERVICE = NO DEDUCTION
            // =====================================

            if (requestedStatus === "failed") {

                const usage =
                    await ServiceUsage.create({

                        user:
                            req.user._id,

                        service:
                            service._id,

                        serviceName:
                            service.name,

                        category:
                            service.category,

                        price:
                            Number(service.price) || 0,

                        charge:
                            0,

                        status:
                            "failed",

                        comment

                    });

                return res.status(201).json({

                    success: true,

                    message:
                        "Service failed. No amount was deducted from wallet.",

                    usage,

                    wallet: {
                        balance: null
                    }

                });

            }


            // =====================================
            // SERVICE PRICE
            // =====================================

            const charge =
                Number(service.price);


            if (
                !Number.isFinite(charge) ||
                charge < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid service price"

                });

            }


            // =====================================
            // FIND USER WALLET
            // =====================================

            let wallet =
                await Wallet.findOne({

                    user:
                        req.user._id

                });


            // =====================================
            // CREATE WALLET IF NOT EXISTS
            // =====================================

            if (!wallet) {

                wallet =
                    await Wallet.create({

                        user:
                            req.user._id,

                        balance:
                            0

                    });

            }


            // =====================================
            // CHECK WALLET BALANCE
            // =====================================

            if (
                wallet.balance < charge
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Insufficient wallet balance",

                    requiredAmount:
                        charge,

                    walletBalance:
                        wallet.balance,

                    shortfall:
                        Number(
                            (
                                charge -
                                wallet.balance
                            ).toFixed(2)
                        )

                });

            }


            // =====================================
            // SAVE BALANCE BEFORE
            // =====================================

            const balanceBefore =
                wallet.balance;


            // =====================================
            // DEDUCT WALLET
            // =====================================

            wallet.balance =
                Number(
                    (
                        wallet.balance -
                        charge
                    ).toFixed(2)
                );


            await wallet.save();


            // =====================================
            // CREATE SERVICE USAGE FIRST
            // =====================================

            const usage =
                await ServiceUsage.create({

                    user:
                        req.user._id,

                    service:
                        service._id,

                    serviceName:
                        service.name,

                    category:
                        service.category,

                    price:
                        charge,

                    charge:
                        charge,

                    status:
                        "success",

                    comment

                });


            // =====================================
            // CREATE WALLET TRANSACTION
            // =====================================

            const walletTransaction =
                await WalletTransaction.create({

                    user:
                        req.user._id,

                    type:
                        "DEBIT",

                    amount:
                        charge,

                    balanceBefore:
                        balanceBefore,

                    balanceAfter:
                        wallet.balance,

                    reason:
                        `Service: ${service.name}`,

                    status:
                        "SUCCESS",

                    referenceId:
                        usage._id.toString()

                });


            // =====================================
            // SUCCESS RESPONSE
            // =====================================

            return res.status(201).json({

                success: true,

                message:
                    "Service usage recorded and wallet debited successfully",

                service: {

                    id:
                        service._id,

                    name:
                        service.name,

                    price:
                        charge

                },

                usage,

                wallet: {

                    balance:
                        wallet.balance,

                    deducted:
                        charge,

                    balanceBefore:
                        balanceBefore,

                    balanceAfter:
                        wallet.balance

                },

                transaction:
                    walletTransaction

            });


        } catch (error) {

            console.error(
                "Record service usage error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to record service usage",

                error:
                    error.message

            });

        }

    }
);


// =====================================
// GET MY APPLIED HISTORY
// =====================================

router.get(
    "/my-history",
    authenticateUser,
    async (req, res) => {

        try {

            const history =
                await ServiceUsage.find({

                    user:
                        req.user._id

                })
                .select(
                    "service serviceName category price charge status comment createdAt"
                )
                .sort({

                    createdAt: -1

                });


            return res.json({

                success: true,

                count:
                    history.length,

                history

            });


        } catch (error) {

            console.error(
                "User service history error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch service history"

            });

        }

    }
);


export default router;