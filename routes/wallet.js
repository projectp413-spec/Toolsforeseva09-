
// import express from "express";
// import mongoose from "mongoose";

// import Wallet from "../models/Wallet.js";
// import WalletTransaction from "../models/WalletTransaction.js";
// import User from "../models/User.js";

// const router = express.Router();


// // =====================================================
// // HELPER
// // =====================================================

// function getUserId(req) {

//     // JWT middleware laga hua ho to
//     if (req.user?._id) {
//         return req.user._id;
//     }

//     if (req.user?.id) {
//         return req.user.id;
//     }

//     // Testing ke liye header
//     if (req.headers["x-user-id"]) {
//         return req.headers["x-user-id"];
//     }

//     return null;
// }


// // =====================================================
// // GET WALLET
// // =====================================================

// router.get("/", async (req, res) => {

//     try {

//         const userId = getUserId(req);

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User authentication required"
//             });
//         }

//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid user ID"
//             });
//         }

//         let wallet = await Wallet.findOne({
//             user: userId
//         });

//         // Agar wallet nahi hai to automatically create
//         if (!wallet) {

//             wallet = await Wallet.create({
//                 user: userId,
//                 balance: 0
//             });
//         }

//         return res.json({
//             success: true,
//             wallet: {
//                 balance: wallet.balance
//             }
//         });

//     } catch (error) {

//         console.error("Wallet fetch error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch wallet"
//         });
//     }
// });


// // =====================================================
// // CREATE WALLET
// // =====================================================

// router.post("/create", async (req, res) => {

//     try {

//         const userId = getUserId(req);

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User authentication required"
//             });
//         }

//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid user ID"
//             });
//         }

//         const existingWallet = await Wallet.findOne({
//             user: userId
//         });

//         if (existingWallet) {

//             return res.json({
//                 success: true,
//                 message: "Wallet already exists",
//                 wallet: {
//                     balance: existingWallet.balance
//                 }
//             });
//         }

//         const wallet = await Wallet.create({
//             user: userId,
//             balance: 0
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Wallet created successfully",
//             wallet: {
//                 balance: wallet.balance
//             }
//         });

//     } catch (error) {

//         console.error("Wallet creation error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to create wallet"
//         });
//     }
// });


// // =====================================================
// // GET TRANSACTION HISTORY
// // =====================================================

// router.get("/transactions", async (req, res) => {

//     try {

//         const userId = getUserId(req);

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User authentication required"
//             });
//         }

//         const transactions =
//             await WalletTransaction
//                 .find({ user: userId })
//                 .sort({ createdAt: -1 });

//         return res.json({
//             success: true,
//             count: transactions.length,
//             transactions
//         });

//     } catch (error) {

//         console.error(
//             "Transaction history error:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch transactions"
//         });
//     }
// });


// // =====================================================
// // ADMIN / TEST CREDIT
// // =====================================================
// // Abhi payment gateway nahi laga hai.
// // Is route se testing ke liye wallet me money add kar sakte ho.
// //
// // Baad me isi jagah payment gateway success ke baad
// // CREDIT hoga.
// // =====================================================

// router.post("/credit", async (req, res) => {

//     try {

//         const userId = getUserId(req);

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User authentication required"
//             });
//         }

//         const amount = Number(req.body.amount);

//         if (!amount || amount <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Valid amount is required"
//             });
//         }

//         let wallet = await Wallet.findOne({
//             user: userId
//         });

//         if (!wallet) {

//             wallet = await Wallet.create({
//                 user: userId,
//                 balance: 0
//             });
//         }

//         const balanceBefore = wallet.balance;

//         wallet.balance += amount;

//         await wallet.save();

//         const transaction =
//             await WalletTransaction.create({

//                 user: userId,

//                 type: "CREDIT",

//                 amount,

//                 balanceBefore,

//                 balanceAfter: wallet.balance,

//                 reason:
//                     req.body.reason ||
//                     "Wallet credited",

//                 status: "SUCCESS",

//                 referenceId:
//                     req.body.referenceId || null
//             });

//         return res.json({
//             success: true,

//             message: "Money added successfully",

//             wallet: {
//                 balance: wallet.balance
//             },

//             transaction
//         });

//     } catch (error) {

//         console.error(
//             "Wallet credit error:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: "Failed to add money"
//         });
//     }
// });


// // =====================================================
// // DEBIT WALLET
// // =====================================================
// // Service request ke waqt isi logic ko use karenge.
// // =====================================================

// router.post("/debit", async (req, res) => {

//     try {

//         const userId = getUserId(req);

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User authentication required"
//             });
//         }

//         const amount = Number(req.body.amount);

//         if (!amount || amount <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Valid amount is required"
//             });
//         }

//         const wallet = await Wallet.findOne({
//             user: userId
//         });

//         if (!wallet) {

//             return res.status(404).json({
//                 success: false,
//                 message: "Wallet not found"
//             });
//         }

//         // IMPORTANT
//         // Balance check server side hoga

//         if (wallet.balance < amount) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Insufficient wallet balance",
//                 requiredAmount: amount,
//                 walletBalance: wallet.balance
//             });
//         }

//         const balanceBefore = wallet.balance;

//         wallet.balance -= amount;

//         await wallet.save();

//         const transaction =
//             await WalletTransaction.create({

//                 user: userId,

//                 type: "DEBIT",

//                 amount,

//                 balanceBefore,

//                 balanceAfter: wallet.balance,

//                 reason:
//                     req.body.reason ||
//                     "Wallet debited",

//                 status: "SUCCESS",

//                 referenceId:
//                     req.body.referenceId || null
//             });

//         return res.json({

//             success: true,

//             message: "Amount deducted successfully",

//             wallet: {
//                 balance: wallet.balance
//             },

//             transaction

//         });

//     } catch (error) {

//         console.error(
//             "Wallet debit error:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: "Failed to debit wallet"
//         });
//     }
// });


// export default router;




import express from "express";
import mongoose from "mongoose";

import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import User from "../models/User.js";

const router = express.Router();


// =====================================================
// DITACORE CONFIG
// =====================================================

const DITACORE_API_URL =
    process.env.DITACORE_API_URL ||
    "https://api.ditacore.com";

const DITACORE_USER_TOKEN =
    process.env.DITACORE_USER_TOKEN;

const PAYMENT_REDIRECT_URL =
    process.env.PAYMENT_REDIRECT_URL ||
    "http://localhost:5500/payment-success.html";


// =====================================================
// HELPER
// =====================================================

function getUserId(req) {

    if (req.user?._id) {
        return req.user._id;
    }

    if (req.user?.id) {
        return req.user.id;
    }

    if (req.headers["x-user-id"]) {
        return req.headers["x-user-id"];
    }

    return null;
}


// =====================================================
// GET WALLET
// =====================================================

router.get("/", async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        let wallet = await Wallet.findOne({
            user: userId
        });

        if (!wallet) {

            wallet = await Wallet.create({
                user: userId,
                balance: 0
            });
        }

        return res.json({
            success: true,
            wallet: {
                balance: wallet.balance
            }
        });

    } catch (error) {

        console.error("Wallet fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet"
        });
    }
});


// =====================================================
// CREATE WALLET
// =====================================================

router.post("/create", async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const existingWallet =
            await Wallet.findOne({
                user: userId
            });

        if (existingWallet) {

            return res.json({
                success: true,
                message: "Wallet already exists",
                wallet: {
                    balance: existingWallet.balance
                }
            });
        }

        const wallet =
            await Wallet.create({
                user: userId,
                balance: 0
            });

        return res.status(201).json({

            success: true,

            message:
                "Wallet created successfully",

            wallet: {
                balance: wallet.balance
            }

        });

    } catch (error) {

        console.error(
            "Wallet creation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create wallet"
        });
    }
});


// =====================================================
// GET TRANSACTION HISTORY
// =====================================================

router.get("/transactions", async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const transactions =
            await WalletTransaction
                .find({
                    user: userId
                })
                .sort({
                    createdAt: -1
                });

        return res.json({

            success: true,

            count:
                transactions.length,

            transactions

        });

    } catch (error) {

        console.error(
            "Transaction history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        });
    }
});


// =====================================================
// TEST CREDIT
// =====================================================

router.post("/credit", async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const amount =
            Number(req.body.amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

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

        const balanceBefore =
            wallet.balance;

        wallet.balance += amount;

        await wallet.save();

        const transaction =
            await WalletTransaction.create({

                user: userId,

                type: "CREDIT",

                amount,

                balanceBefore,

                balanceAfter:
                    wallet.balance,

                reason:
                    req.body.reason ||
                    "Wallet credited",

                status: "SUCCESS",

                referenceId:
                    req.body.referenceId ||
                    null

            });

        return res.json({

            success: true,

            message:
                "Money added successfully",

            wallet: {
                balance:
                    wallet.balance
            },

            transaction

        });

    } catch (error) {

        console.error(
            "Wallet credit error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to add money"
        });
    }
});


// =====================================================
// DEBIT WALLET
// =====================================================

router.post("/debit", async (req, res) => {

    try {

        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const amount =
            Number(req.body.amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        const wallet =
            await Wallet.findOne({
                user: userId
            });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        if (wallet.balance < amount) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient wallet balance",

                requiredAmount:
                    amount,

                walletBalance:
                    wallet.balance

            });
        }

        const balanceBefore =
            wallet.balance;

        wallet.balance -= amount;

        await wallet.save();

        const transaction =
            await WalletTransaction.create({

                user: userId,

                type: "DEBIT",

                amount,

                balanceBefore,

                balanceAfter:
                    wallet.balance,

                reason:
                    req.body.reason ||
                    "Wallet debited",

                status: "SUCCESS",

                referenceId:
                    req.body.referenceId ||
                    null

            });

        return res.json({

            success: true,

            message:
                "Amount deducted successfully",

            wallet: {
                balance:
                    wallet.balance
            },

            transaction

        });

    } catch (error) {

        console.error(
            "Wallet debit error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to debit wallet"
        });
    }
});


// =====================================================
// CREATE DITACORE PAYMENT ORDER
// =====================================================

router.post(
    "/payment/create-order",
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {

                return res.status(401).json({
                    success: false,
                    message:
                        "User authentication required"
                });

            }

            if (!DITACORE_USER_TOKEN) {

                return res.status(500).json({
                    success: false,
                    message:
                        "DITACORE API token is not configured"
                });

            }


            // -----------------------------------------
            // AMOUNT
            // -----------------------------------------

            const amount =
                Number(req.body.amount);

            if (
                !amount ||
                amount <= 0 ||
                !Number.isFinite(amount)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Valid payment amount is required"
                });

            }


            // -----------------------------------------
            // USER
            // -----------------------------------------

            const user =
                await User.findById(userId);

            if (!user) {

                return res.status(404).json({
                    success: false,
                    message:
                        "User not found"
                });

            }


            // -----------------------------------------
            // MOBILE
            // -----------------------------------------

            const customerMobile =
                user.mobile ||
                user.phone ||
                req.body.customer_mobile;

            if (!customerMobile) {

                return res.status(400).json({
                    success: false,
                    message:
                        "User mobile number is required"
                });

            }


            // -----------------------------------------
            // UNIQUE ORDER ID
            // -----------------------------------------

            const orderId =
                `ESV${Date.now()}${Math.floor(
                    Math.random() * 1000
                )}`;


            // -----------------------------------------
            // DITACORE FORM DATA
            // -----------------------------------------

            const formData =
                new URLSearchParams();

            formData.append(
                "customer_mobile",
                String(customerMobile)
            );

            formData.append(
                "user_token",
                DITACORE_USER_TOKEN
            );

            formData.append(
                "amount",
                String(amount)
            );

            formData.append(
                "order_id",
                orderId
            );

            formData.append(
                "redirect_url",
                PAYMENT_REDIRECT_URL
            );

            formData.append(
                "remark1",
                "eSeva Wallet Recharge"
            );

            formData.append(
                "remark2",
                String(userId)
            );


            // -----------------------------------------
            // CALL DITACORE
            // -----------------------------------------

            const response =
                await fetch(
                    `${DITACORE_API_URL}/api/create-order`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body:
                            formData.toString()
                    }
                );


            const data =
                await response.json();


            console.log(
                "DITACORE CREATE ORDER:",
                data
            );


            // -----------------------------------------
            // FAILED
            // -----------------------------------------

            if (
                !response.ok ||
                data.status === false ||
                data.status === "false"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        data.message ||
                        "Failed to create payment order",

                    gatewayResponse:
                        data

                });

            }


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            const paymentUrl =
                data.result?.payment_url ||
                data.payment_url;

            if (!paymentUrl) {

                return res.status(502).json({

                    success: false,

                    message:
                        "Payment URL was not received from DITACORE",

                    gatewayResponse:
                        data

                });

            }


            return res.json({

                success: true,

                message:
                    "Payment order created successfully",

                orderId,

                amount,

                paymentUrl,

                gatewayResponse:
                    data

            });


        } catch (error) {

            console.error(
                "DITACORE create order error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to create payment order"

            });

        }

    }
);


// =====================================================
// CHECK DITACORE PAYMENT STATUS
// =====================================================

router.post(
    "/payment/check-status",
    async (req, res) => {

        try {

            const userId =
                getUserId(req);

            if (!userId) {

                return res.status(401).json({
                    success: false,
                    message:
                        "User authentication required"
                });

            }

            if (!DITACORE_USER_TOKEN) {

                return res.status(500).json({
                    success: false,
                    message:
                        "DITACORE API token is not configured"
                });

            }


            const orderId =
                String(
                    req.body.order_id || ""
                ).trim();


            if (!orderId) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Order ID is required"
                });

            }


            // -----------------------------------------
            // CHECK WHETHER THIS ORDER WAS ALREADY
            // CREDITED
            // -----------------------------------------

            const alreadyCredited =
                await WalletTransaction.findOne({

                    user: userId,

                    type: "CREDIT",

                    referenceId: orderId,

                    status: "SUCCESS"

                });


            if (alreadyCredited) {

                const wallet =
                    await Wallet.findOne({
                        user: userId
                    });

                return res.json({

                    success: true,

                    paymentStatus:
                        "COMPLETED",

                    message:
                        "Payment already credited",

                    alreadyCredited: true,

                    wallet: {
                        balance:
                            wallet?.balance || 0
                    },

                    transaction:
                        alreadyCredited

                });

            }


            // -----------------------------------------
            // CALL DITACORE STATUS API
            // -----------------------------------------

            const formData =
                new URLSearchParams();

            formData.append(
                "user_token",
                DITACORE_USER_TOKEN
            );

            formData.append(
                "order_id",
                orderId
            );


            const response =
                await fetch(
                    `${DITACORE_API_URL}/api/check-order-status`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body:
                            formData.toString()
                    }
                );


            const data =
                await response.json();


            console.log(
                "DITACORE CHECK STATUS:",
                data
            );


            // -----------------------------------------
            // GET STATUS
            // -----------------------------------------

            const gatewayStatus =
                String(
                    data.status || ""
                ).toUpperCase();

            const transactionStatus =
                String(
                    data.result?.status || ""
                ).toUpperCase();


            const isCompleted =
                gatewayStatus === "COMPLETED" ||
                gatewayStatus === "SUCCESS" ||
                transactionStatus === "SUCCESS" ||
                transactionStatus === "COMPLETED";


            // -----------------------------------------
            // PAYMENT NOT SUCCESSFUL
            // -----------------------------------------

            if (!isCompleted) {

                return res.json({

                    success: true,

                    paymentStatus:
                        gatewayStatus ||
                        transactionStatus ||
                        "PENDING",

                    message:
                        data.message ||
                        "Payment is not completed yet",

                    gatewayResponse:
                        data

                });

            }


            // -----------------------------------------
            // GET PAID AMOUNT
            // -----------------------------------------

            const paidAmount =
                Number(
                    data.result?.amount ||
                    data.amount ||
                    req.body.amount
                );


            if (
                !paidAmount ||
                paidAmount <= 0 ||
                !Number.isFinite(paidAmount)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment completed but valid amount was not received"

                });

            }


            // -----------------------------------------
            // GET / CREATE WALLET
            // -----------------------------------------

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


            // -----------------------------------------
            // FINAL DUPLICATE CHECK
            // -----------------------------------------

            const duplicate =
                await WalletTransaction.findOne({

                    user: userId,

                    type: "CREDIT",

                    referenceId: orderId

                });


            if (duplicate) {

                return res.json({

                    success: true,

                    paymentStatus:
                        "COMPLETED",

                    message:
                        "Payment already processed",

                    wallet: {
                        balance:
                            wallet.balance
                    },

                    transaction:
                        duplicate

                });

            }


            // -----------------------------------------
            // CREDIT WALLET
            // -----------------------------------------

            const balanceBefore =
                wallet.balance;

            wallet.balance += paidAmount;

            await wallet.save();


            // -----------------------------------------
            // TRANSACTION
            // -----------------------------------------

            const transaction =
                await WalletTransaction.create({

                    user: userId,

                    type: "CREDIT",

                    amount: paidAmount,

                    balanceBefore,

                    balanceAfter:
                        wallet.balance,

                    reason:
                        "DITACORE Wallet Recharge",

                    status:
                        "SUCCESS",

                    referenceId:
                        orderId

                });


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            return res.json({

                success: true,

                paymentStatus:
                    "COMPLETED",

                message:
                    "Payment successful and wallet credited",

                wallet: {

                    balance:
                        wallet.balance

                },

                transaction,

                gatewayResponse:
                    data

            });


        } catch (error) {

            console.error(
                "DITACORE check status error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to check payment status"

            });

        }

    }
);


export default router;