

// import express from "express";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";
// import Wallet from "../models/Wallet.js";
// import WalletTransaction from "../models/WalletTransaction.js";

// const router = express.Router();


// // =====================================================
// // CONFIG
// // =====================================================

// const DITACORE_BASE_URL =
//     process.env.DITACORE_BASE_URL ||
//     "https://api.ditacore.com";

// const DITACORE_USER_TOKEN =
//     process.env.DITACORE_USER_TOKEN;

// const PAYMENT_REDIRECT_URL =
//     process.env.PAYMENT_REDIRECT_URL ||
//     "http://localhost:8000/api/payment/callback";


// // =====================================================
// // AUTHENTICATION
// // =====================================================

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

//         const userId =
//             decoded.userId ||
//             decoded.id ||
//             decoded._id;

//         if (!userId) {

//             return res.status(401).json({

//                 success: false,

//                 message:
//                     "Invalid authentication token"

//             });

//         }

//         const user =
//             await User.findById(userId);

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
//             "Payment authentication error:",
//             error.message
//         );

//         return res.status(401).json({

//             success: false,

//             message:
//                 "Invalid or expired token"

//         });

//     }

// }


// // =====================================================
// // CREATE PAYMENT ORDER
// // =====================================================

// router.post(
//     "/create-order",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             // -----------------------------------------
//             // CHECK TOKEN
//             // -----------------------------------------

//             if (!DITACORE_USER_TOKEN) {

//                 return res.status(500).json({

//                     success: false,

//                     message:
//                         "DITACORE_USER_TOKEN is missing in .env"

//                 });

//             }


//             // -----------------------------------------
//             // AMOUNT
//             // -----------------------------------------

//             const amount =
//                 Number(req.body.amount);

//             if (
//                 !Number.isFinite(amount) ||
//                 amount <= 0
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Valid amount is required"

//                 });

//             }


//             // -----------------------------------------
//             // MOBILE
//             // -----------------------------------------

//             const mobile =
//                 req.user.mobile ||
//                 req.user.phone ||
//                 req.user.mobileNumber ||
//                 req.body.customer_mobile;

//             if (!mobile) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "User mobile number is required"

//                 });

//             }


//             // -----------------------------------------
//             // UNIQUE ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 `ESV${Date.now()}${Math.floor(
//                     Math.random() * 10000
//                 )}`;


//             console.log(
//                 "Creating DITACORE order:",
//                 orderId
//             );


//             // -----------------------------------------
//             // FORM DATA
//             // -----------------------------------------

//             const formData =
//                 new URLSearchParams();

//             formData.append(
//                 "customer_mobile",
//                 String(mobile)
//             );

//             formData.append(
//                 "user_token",
//                 DITACORE_USER_TOKEN
//             );

//             formData.append(
//                 "amount",
//                 amount.toFixed(2)
//             );

//             formData.append(
//                 "order_id",
//                 orderId
//             );

//             formData.append(
//                 "redirect_url",
//                 PAYMENT_REDIRECT_URL
//             );

//             formData.append(
//                 "remark1",
//                 "eSeva Wallet Recharge"
//             );

//             formData.append(
//                 "remark2",
//                 String(req.user._id)
//             );


//             // -----------------------------------------
//             // DITACORE API
//             // -----------------------------------------

//             const response =
//                 await fetch(
//                     `${DITACORE_BASE_URL}/api/create-order`,
//                     {

//                         method: "POST",

//                         headers: {

//                             "Content-Type":
//                                 "application/x-www-form-urlencoded"

//                         },

//                         body:
//                             formData.toString()

//                     }
//                 );


//             const data =
//                 await response.json();


//             console.log(
//                 "DITACORE response:",
//                 data
//             );


//             // -----------------------------------------
//             // CHECK RESPONSE
//             // -----------------------------------------

//             if (!response.ok) {

//                 return res.status(502).json({

//                     success: false,

//                     message:
//                         "DITACORE payment server returned an error",

//                     gatewayResponse:
//                         data

//                 });

//             }


//             // -----------------------------------------
//             // PAYMENT URL
//             // -----------------------------------------

//             const paymentUrl =
//                 data.result?.payment_url ||
//                 data.payment_url ||
//                 data.result?.paymentUrl ||
//                 data.paymentUrl;


//             if (!paymentUrl) {

//                 return res.status(502).json({

//                     success: false,

//                     message:
//                         data.message ||
//                         "Payment URL not received from DITACORE",

//                     gatewayResponse:
//                         data

//                 });

//             }


//             // -----------------------------------------
//             // SUCCESS
//             // -----------------------------------------

//             return res.json({

//                 success: true,

//                 message:
//                     "Payment order created successfully",

//                 orderId,

//                 amount,

//                 paymentUrl

//             });

//         } catch (error) {

//             console.error(
//                 "Create payment order error:",
//                 error
//             );

//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to create payment order",

//                 error:
//                     error.message

//             });

//         }

//     }
// );


// // =====================================================
// // CHECK PAYMENT STATUS
// // =====================================================

// router.post(
//     "/check-status",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             if (!DITACORE_USER_TOKEN) {

//                 return res.status(500).json({

//                     success: false,

//                     message:
//                         "DITACORE_USER_TOKEN is missing in .env"

//                 });

//             }


//             const orderId =
//                 String(
//                     req.body.order_id || ""
//                 ).trim();


//             if (!orderId) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "order_id is required"

//                 });

//             }


//             // -----------------------------------------
//             // CHECK ALREADY CREDITED
//             // -----------------------------------------

//             const existingTransaction =
//                 await WalletTransaction.findOne({

//                     user: req.user._id,

//                     type: "CREDIT",

//                     referenceId: orderId,

//                     status: "SUCCESS"

//                 });


//             if (existingTransaction) {

//                 const wallet =
//                     await Wallet.findOne({

//                         user: req.user._id

//                     });

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "SUCCESS",

//                     message:
//                         "Payment already credited",

//                     alreadyCredited:
//                         true,

//                     wallet: {

//                         balance:
//                             wallet?.balance || 0

//                     },

//                     transaction:
//                         existingTransaction

//                 });

//             }


//             // -----------------------------------------
//             // FORM DATA
//             // -----------------------------------------

//             const formData =
//                 new URLSearchParams();

//             formData.append(
//                 "user_token",
//                 DITACORE_USER_TOKEN
//             );

//             formData.append(
//                 "order_id",
//                 orderId
//             );


//             // -----------------------------------------
//             // CHECK DITACORE STATUS
//             // -----------------------------------------

//             const response =
//                 await fetch(
//                     `${DITACORE_BASE_URL}/api/check-order-status`,
//                     {

//                         method: "POST",

//                         headers: {

//                             "Content-Type":
//                                 "application/x-www-form-urlencoded"

//                         },

//                         body:
//                             formData.toString()

//                     }
//                 );


//             const data =
//                 await response.json();


//             console.log(
//                 "DITACORE status response:",
//                 data
//             );


//             // -----------------------------------------
//             // GET STATUS
//             // -----------------------------------------

//             const statusValues = [

//                 data.status,

//                 data.result?.status,

//                 data.result?.payment_status,

//                 data.payment_status,

//                 data.order_status

//             ]
//                 .filter(Boolean)
//                 .map(value =>
//                     String(value).toUpperCase()
//                 );


//             const isSuccess =
//                 statusValues.includes("SUCCESS") ||
//                 statusValues.includes("COMPLETED") ||
//                 statusValues.includes("PAID");


//             const isFailed =
//                 statusValues.includes("FAILED") ||
//                 statusValues.includes("FAILURE") ||
//                 statusValues.includes("CANCELLED") ||
//                 statusValues.includes("REJECTED");


//             // -----------------------------------------
//             // FAILED
//             // -----------------------------------------

//             if (isFailed) {

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "FAILED",

//                     message:
//                         "Payment failed",

//                     gatewayResponse:
//                         data

//                 });

//             }


//             // -----------------------------------------
//             // PENDING
//             // -----------------------------------------

//             if (!isSuccess) {

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         statusValues[0] ||
//                         "PENDING",

//                     message:
//                         "Payment is still pending",

//                     gatewayResponse:
//                         data

//                 });

//             }


//             // -----------------------------------------
//             // GET AMOUNT
//             // -----------------------------------------

//             const paidAmount =
//                 Number(

//                     data.result?.amount ||

//                     data.amount ||

//                     data.result?.paid_amount ||

//                     data.paid_amount ||

//                     req.body.amount

//                 );


//             if (
//                 !Number.isFinite(paidAmount) ||
//                 paidAmount <= 0
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Payment successful but valid amount was not received from gateway",

//                     gatewayResponse:
//                         data

//                 });

//             }


//             // -----------------------------------------
//             // GET WALLET
//             // -----------------------------------------

//             let wallet =
//                 await Wallet.findOne({

//                     user: req.user._id

//                 });


//             if (!wallet) {

//                 wallet =
//                     await Wallet.create({

//                         user:
//                             req.user._id,

//                         balance: 0

//                     });

//             }


//             // -----------------------------------------
//             // SECOND DUPLICATE CHECK
//             // -----------------------------------------

//             const duplicate =
//                 await WalletTransaction.findOne({

//                     user: req.user._id,

//                     type: "CREDIT",

//                     referenceId: orderId

//                 });


//             if (duplicate) {

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "SUCCESS",

//                     message:
//                         "Payment already processed",

//                     wallet: {

//                         balance:
//                             wallet.balance

//                     },

//                     transaction:
//                         duplicate

//                 });

//             }


//             // -----------------------------------------
//             // CREDIT WALLET
//             // -----------------------------------------

//             const balanceBefore =
//                 wallet.balance;

//             wallet.balance =
//                 wallet.balance +
//                 paidAmount;

//             await wallet.save();


//             // -----------------------------------------
//             // SAVE TRANSACTION
//             // -----------------------------------------

//             const transaction =
//                 await WalletTransaction.create({

//                     user:
//                         req.user._id,

//                     type:
//                         "CREDIT",

//                     amount:
//                         paidAmount,

//                     balanceBefore,

//                     balanceAfter:
//                         wallet.balance,

//                     reason:
//                         "DITACORE Wallet Recharge",

//                     status:
//                         "SUCCESS",

//                     referenceId:
//                         orderId

//                 });


//             // -----------------------------------------
//             // RESPONSE
//             // -----------------------------------------

//             return res.json({

//                 success: true,

//                 paymentStatus:
//                     "SUCCESS",

//                 message:
//                     "Payment successful and wallet credited",

//                 wallet: {

//                     balance:
//                         wallet.balance

//                 },

//                 transaction

//             });

//         } catch (error) {

//             console.error(
//                 "Payment status error:",
//                 error
//             );

//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to check payment status",

//                 error:
//                     error.message

//             });

//         }

//     }
// );


// // =====================================================
// // PAYMENT CALLBACK
// // =====================================================
// //
// // DITACORE redirect ke is URL par aa sakta hai:
// //
// // /api/payment/callback
// //
// // Hum yahan payment ko automatically credit nahi kar rahe.
// // Frontend / status check endpoint se gateway status
// // verify karke wallet credit hoga.
// // =====================================================

// router.get(
//     "/callback",
//     async (req, res) => {

//         try {

//             const orderId =
//                 req.query.order_id ||
//                 req.query.orderId;

//             if (!orderId) {

//                 return res.status(400).send(
//                     "Payment callback received but order ID is missing."
//                 );

//             }

//             return res.send(`

//                 <!DOCTYPE html>

//                 <html>

//                 <head>

//                     <title>Payment Processing</title>

//                     <meta
//                         name="viewport"
//                         content="width=device-width, initial-scale=1"
//                     >

//                 </head>

//                 <body
//                     style="
//                         font-family: Arial;
//                         text-align: center;
//                         padding: 50px;
//                     "
//                 >

//                     <h2>
//                         Payment Received
//                     </h2>

//                     <p>
//                         Your payment is being verified.
//                     </p>

//                     <p>
//                         Order ID:
//                         <strong>
//                             ${orderId}
//                         </strong>
//                     </p>

//                     <p>
//                         Please return to eSeva and check
//                         your wallet balance.
//                     </p>

//                 </body>

//                 </html>

//             `);

//         } catch (error) {

//             console.error(
//                 "Payment callback error:",
//                 error
//             );

//             return res.status(500).send(
//                 "Payment callback failed."
//             );

//         }

//     }
// );


// export default router;




// import express from "express";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";
// import Wallet from "../models/Wallet.js";
// import WalletTransaction from "../models/WalletTransaction.js";
// import Payment from "../models/Payment.js";

// const router = express.Router();


// // =====================================================
// // CONFIG
// // =====================================================

// const DITACORE_BASE_URL =
//     process.env.DITACORE_BASE_URL ||
//     "https://api.ditacore.com";

// const DITACORE_USER_TOKEN =
//     process.env.DITACORE_USER_TOKEN;

// const PAYMENT_REDIRECT_URL =
//     process.env.PAYMENT_REDIRECT_URL ||
//     "http://localhost:8000/api/payment/callback";


// // =====================================================
// // AUTHENTICATION
// // =====================================================

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
//                 message: "Authentication token required"
//             });
//         }

//         const token =
//             authHeader.split(" ")[1];

//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );

//         const userId =
//             decoded.userId ||
//             decoded.id ||
//             decoded._id;

//         if (!userId) {

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid authentication token"
//             });
//         }

//         const user =
//             await User.findById(userId);

//         if (!user) {

//             return res.status(401).json({
//                 success: false,
//                 message: "User not found"
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
//             "Payment authentication error:",
//             error.message
//         );

//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token"
//         });
//     }
// }


// // =====================================================
// // CREATE PAYMENT ORDER
// // =====================================================

// router.post(
//     "/create-order",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             // -----------------------------------------
//             // CHECK DITACORE TOKEN
//             // -----------------------------------------

//             if (!DITACORE_USER_TOKEN) {

//                 return res.status(500).json({
//                     success: false,
//                     message:
//                         "DITACORE_USER_TOKEN is missing in .env"
//                 });
//             }


//             // -----------------------------------------
//             // AMOUNT
//             // -----------------------------------------

//             const amount =
//                 Number(req.body.amount);

//             if (
//                 !Number.isFinite(amount) ||
//                 amount <= 0
//             ) {

//                 return res.status(400).json({
//                     success: false,
//                     message: "Valid amount is required"
//                 });
//             }


//             // -----------------------------------------
//             // MOBILE
//             // -----------------------------------------

//             const mobile =
//                 req.user.mobile ||
//                 req.user.phone ||
//                 req.user.mobileNumber ||
//                 req.body.customer_mobile;

//             if (!mobile) {

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         "User mobile number is required"
//                 });
//             }


//             // -----------------------------------------
//             // UNIQUE ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 `ESV${Date.now()}${Math.floor(
//                     Math.random() * 10000
//                 )}`;

//             console.log(
//                 "Creating DITACORE order:",
//                 orderId
//             );

//             console.log(
//                 "Payment User:",
//                 req.user._id.toString()
//             );

//             console.log(
//                 "Payment Amount:",
//                 amount
//             );


//             // -----------------------------------------
//             // CALLBACK URL
//             // -----------------------------------------

//             const callbackUrl =
//                 `${PAYMENT_REDIRECT_URL}?order_id=${encodeURIComponent(
//                     orderId
//                 )}`;


//             // -----------------------------------------
//             // FORM DATA
//             // -----------------------------------------

//             const formData =
//                 new URLSearchParams();

//             formData.append(
//                 "customer_mobile",
//                 String(mobile)
//             );

//             formData.append(
//                 "user_token",
//                 DITACORE_USER_TOKEN
//             );

//             formData.append(
//                 "amount",
//                 amount.toFixed(2)
//             );

//             formData.append(
//                 "order_id",
//                 orderId
//             );

//             formData.append(
//                 "redirect_url",
//                 callbackUrl
//             );

//             formData.append(
//                 "remark1",
//                 "eSeva Wallet Recharge"
//             );

//             formData.append(
//                 "remark2",
//                 String(req.user._id)
//             );


//             // -----------------------------------------
//             // DITACORE API
//             // -----------------------------------------

//             const response =
//                 await fetch(
//                     `${DITACORE_BASE_URL}/api/create-order`,
//                     {
//                         method: "POST",

//                         headers: {
//                             "Content-Type":
//                                 "application/x-www-form-urlencoded"
//                         },

//                         body:
//                             formData.toString()
//                     }
//                 );


//             const data =
//                 await response.json();


//             console.log(
//                 "DITACORE response:",
//                 data
//             );


//             // -----------------------------------------
//             // CHECK RESPONSE
//             // -----------------------------------------

//             if (!response.ok) {

//                 return res.status(502).json({
//                     success: false,
//                     message:
//                         "DITACORE payment server returned an error",
//                     gatewayResponse: data
//                 });
//             }


//             // -----------------------------------------
//             // PAYMENT URL
//             // -----------------------------------------

//             const paymentUrl =
//                 data.result?.payment_url ||
//                 data.payment_url ||
//                 data.result?.paymentUrl ||
//                 data.paymentUrl;


//             if (!paymentUrl) {

//                 return res.status(502).json({
//                     success: false,
//                     message:
//                         data.message ||
//                         "Payment URL not received from DITACORE",
//                     gatewayResponse: data
//                 });
//             }


//             // -----------------------------------------
//             // SAVE PAYMENT IN DATABASE
//             // -----------------------------------------

//             const payment =
//                 await Payment.create({

//                     orderId,

//                     user:
//                         req.user._id,

//                     amount,

//                     status:
//                         "PENDING",

//                     paymentUrl,

//                     gatewayResponse:
//                         data
//                 });


//             console.log(
//                 "Payment saved in database:",
//                 payment._id
//             );


//             // -----------------------------------------
//             // SUCCESS
//             // -----------------------------------------

//             return res.json({

//                 success: true,

//                 message:
//                     "Payment order created successfully",

//                 orderId,

//                 amount,

//                 paymentUrl
//             });


//         } catch (error) {

//             console.error(
//                 "Create payment order error:",
//                 error
//             );

//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to create payment order",

//                 error:
//                     error.message
//             });
//         }
//     }
// );


// // =====================================================
// // CHECK PAYMENT STATUS
// // =====================================================

// router.post(
//     "/check-status",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             // -----------------------------------------
//             // CHECK DITACORE TOKEN
//             // -----------------------------------------

//             if (!DITACORE_USER_TOKEN) {

//                 return res.status(500).json({
//                     success: false,
//                     message:
//                         "DITACORE_USER_TOKEN is missing in .env"
//                 });
//             }


//             // -----------------------------------------
//             // ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 String(
//                     req.body.order_id || ""
//                 ).trim();


//             if (!orderId) {

//                 return res.status(400).json({
//                     success: false,
//                     message: "order_id is required"
//                 });
//             }


//             // -----------------------------------------
//             // FIND PAYMENT
//             // -----------------------------------------

//             const payment =
//                 await Payment.findOne({
//                     orderId
//                 });


//             if (!payment) {

//                 return res.status(404).json({
//                     success: false,
//                     message:
//                         "Payment order not found"
//                 });
//             }


//             // -----------------------------------------
//             // SECURITY CHECK
//             // -----------------------------------------

//             if (
//                 String(payment.user) !==
//                 String(req.user._id)
//             ) {

//                 return res.status(403).json({
//                     success: false,
//                     message:
//                         "This payment does not belong to the logged-in user"
//                 });
//             }


//             // -----------------------------------------
//             // CHECK ALREADY CREDITED
//             // -----------------------------------------

//             const existingTransaction =
//                 await WalletTransaction.findOne({

//                     user:
//                         req.user._id,

//                     type:
//                         "CREDIT",

//                     referenceId:
//                         orderId,

//                     status:
//                         "SUCCESS"
//                 });


//             if (existingTransaction) {

//                 const wallet =
//                     await Wallet.findOne({
//                         user:
//                             req.user._id
//                     });

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "SUCCESS",

//                     message:
//                         "Payment already credited",

//                     alreadyCredited:
//                         true,

//                     wallet: {

//                         balance:
//                             wallet?.balance || 0
//                     },

//                     transaction:
//                         existingTransaction
//                 });
//             }


//             // -----------------------------------------
//             // FORM DATA
//             // -----------------------------------------

//             const formData =
//                 new URLSearchParams();

//             formData.append(
//                 "user_token",
//                 DITACORE_USER_TOKEN
//             );

//             formData.append(
//                 "order_id",
//                 orderId
//             );


//             // -----------------------------------------
//             // CHECK DITACORE STATUS
//             // -----------------------------------------

//             const response =
//                 await fetch(
//                     `${DITACORE_BASE_URL}/api/check-order-status`,
//                     {
//                         method: "POST",

//                         headers: {
//                             "Content-Type":
//                                 "application/x-www-form-urlencoded"
//                         },

//                         body:
//                             formData.toString()
//                     }
//                 );


//             const data =
//                 await response.json();


//             console.log(
//                 "DITACORE status response:",
//                 data
//             );


//             // -----------------------------------------
//             // GET STATUS
//             // -----------------------------------------

//             const statusValues = [

//                 data.status,

//                 data.result?.status,

//                 data.result?.payment_status,

//                 data.payment_status,

//                 data.order_status

//             ]
//                 .filter(Boolean)
//                 .map(value =>
//                     String(value).toUpperCase()
//                 );


//             const isSuccess =
//                 statusValues.includes("SUCCESS") ||
//                 statusValues.includes("COMPLETED") ||
//                 statusValues.includes("PAID");


//             const isFailed =
//                 statusValues.includes("FAILED") ||
//                 statusValues.includes("FAILURE") ||
//                 statusValues.includes("CANCELLED") ||
//                 statusValues.includes("REJECTED");


//             // -----------------------------------------
//             // FAILED
//             // -----------------------------------------

//             if (isFailed) {

//                 payment.status =
//                     "FAILED";

//                 payment.gatewayResponse =
//                     data;

//                 await payment.save();

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "FAILED",

//                     message:
//                         "Payment failed",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // -----------------------------------------
//             // PENDING
//             // -----------------------------------------

//             if (!isSuccess) {

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         statusValues[0] ||
//                         "PENDING",

//                     message:
//                         "Payment is still pending",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // -----------------------------------------
//             // GET PAID AMOUNT
//             // -----------------------------------------

//             const paidAmount =
//                 Number(

//                     data.result?.amount ||

//                     data.amount ||

//                     data.result?.paid_amount ||

//                     data.paid_amount ||

//                     payment.amount

//                 );


//             if (
//                 !Number.isFinite(paidAmount) ||
//                 paidAmount <= 0
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Payment successful but valid amount was not received from gateway",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // -----------------------------------------
//             // AMOUNT SECURITY CHECK
//             // -----------------------------------------

//             if (
//                 paidAmount !==
//                 Number(payment.amount)
//             ) {

//                 console.error(
//                     "Payment amount mismatch:",
//                     {
//                         orderId,
//                         expected:
//                             payment.amount,
//                         received:
//                             paidAmount
//                     }
//                 );

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Payment amount mismatch",

//                     expectedAmount:
//                         payment.amount,

//                     receivedAmount:
//                         paidAmount
//                 });
//             }


//             // -----------------------------------------
//             // GET WALLET
//             // -----------------------------------------

//             let wallet =
//                 await Wallet.findOne({

//                     user:
//                         payment.user
//                 });


//             if (!wallet) {

//                 wallet =
//                     await Wallet.create({

//                         user:
//                             payment.user,

//                         balance:
//                             0
//                     });
//             }


//             // -----------------------------------------
//             // SECOND DUPLICATE CHECK
//             // -----------------------------------------

//             const duplicate =
//                 await WalletTransaction.findOne({

//                     user:
//                         payment.user,

//                     type:
//                         "CREDIT",

//                     referenceId:
//                         orderId
//                 });


//             if (duplicate) {

//                 payment.status =
//                     "COMPLETED";

//                 payment.creditedAt =
//                     payment.creditedAt ||
//                     new Date();

//                 payment.gatewayResponse =
//                     data;

//                 await payment.save();

//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "SUCCESS",

//                     message:
//                         "Payment already processed",

//                     wallet: {

//                         balance:
//                             wallet.balance
//                     },

//                     transaction:
//                         duplicate
//                 });
//             }


//             // -----------------------------------------
//             // CREDIT WALLET
//             // -----------------------------------------

//             const balanceBefore =
//                 wallet.balance;

//             wallet.balance =
//                 wallet.balance +
//                 paidAmount;

//             await wallet.save();


//             // -----------------------------------------
//             // SAVE TRANSACTION
//             // -----------------------------------------

//             const transaction =
//                 await WalletTransaction.create({

//                     user:
//                         payment.user,

//                     type:
//                         "CREDIT",

//                     amount:
//                         paidAmount,

//                     balanceBefore,

//                     balanceAfter:
//                         wallet.balance,

//                     reason:
//                         "DITACORE Wallet Recharge",

//                     status:
//                         "SUCCESS",

//                     referenceId:
//                         orderId
//                 });


//             // -----------------------------------------
//             // UPDATE PAYMENT
//             // -----------------------------------------

//             payment.status =
//                 "COMPLETED";

//             payment.creditedAt =
//                 new Date();

//             payment.gatewayResponse =
//                 data;

//             await payment.save();


//             // -----------------------------------------
//             // RESPONSE
//             // -----------------------------------------

//             return res.json({

//                 success: true,

//                 paymentStatus:
//                     "SUCCESS",

//                 message:
//                     "Payment successful and wallet credited",

//                 orderId,

//                 amount:
//                     paidAmount,

//                 wallet: {

//                     balance:
//                         wallet.balance
//                 },

//                 transaction
//             });


//         } catch (error) {

//             console.error(
//                 "Payment status error:",
//                 error
//             );

//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to check payment status",

//                 error:
//                     error.message
//             });
//         }
//     }
// );


// // =====================================================
// // PAYMENT CALLBACK
// // =====================================================

// router.all(
//     "/callback",
//     async (req, res) => {

//         try {

//             console.log(
//                 "========== PAYMENT CALLBACK =========="
//             );

//             console.log(
//                 "Method:",
//                 req.method
//             );

//             console.log(
//                 "Query:",
//                 req.query
//             );

//             console.log(
//                 "Body:",
//                 req.body
//             );

//             console.log(
//                 "======================================"
//             );


//             // -----------------------------------------
//             // GET ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 req.query.order_id ||
//                 req.query.orderId ||
//                 req.body?.order_id ||
//                 req.body?.orderId;


//             if (!orderId) {

//                 console.log(
//                     "❌ Payment callback: Order ID missing"
//                 );

//                 return res.status(400).send(
//                     "Payment callback received but order ID is missing."
//                 );
//             }


//             console.log(
//                 "✅ Payment callback Order ID:",
//                 orderId
//             );


//             // -----------------------------------------
//             // FIND PAYMENT
//             // -----------------------------------------

//             const payment =
//                 await Payment.findOne({
//                     orderId
//                 });


//             if (!payment) {

//                 return res.status(404).send(
//                     "Payment order not found."
//                 );
//             }


//             // -----------------------------------------
//             // CALLBACK PAGE
//             // -----------------------------------------

//             return res.send(`

//                 <!DOCTYPE html>

//                 <html>

//                 <head>

//                     <title>
//                         Payment Processing
//                     </title>

//                     <meta
//                         name="viewport"
//                         content="width=device-width, initial-scale=1"
//                     >

//                 </head>


//                 <body
//                     style="
//                         font-family: Arial;
//                         text-align: center;
//                         padding: 50px;
//                     "
//                 >

//                     <h2>
//                         Payment Received
//                     </h2>

//                     <p>
//                         Your payment is being verified.
//                     </p>

//                     <p>
//                         Order ID:
//                         <strong>
//                             ${orderId}
//                         </strong>
//                     </p>

//                     <p>
//                         Payment status is being checked.
//                     </p>

//                     <p>
//                         Please return to eSeva
//                         and check your wallet balance.
//                     </p>

//                 </body>

//                 </html>

//             `);


//         } catch (error) {

//             console.error(
//                 "Payment callback error:",
//                 error
//             );

//             return res.status(500).send(
//                 "Payment callback failed."
//             );
//         }
//     }
// );


// export default router;







// import express from "express";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";
// import Wallet from "../models/Wallet.js";
// import WalletTransaction from "../models/WalletTransaction.js";
// import Payment from "../models/Payment.js";

// const router = express.Router();


// // =====================================================
// // CONFIG
// // =====================================================

// const DITACORE_BASE_URL =
//     process.env.DITACORE_BASE_URL ||
//     "https://api.ditacore.com";

// const DITACORE_USER_TOKEN =
//     process.env.DITACORE_USER_TOKEN;

// const PAYMENT_REDIRECT_URL =
//     process.env.PAYMENT_REDIRECT_URL ||
//     "http://localhost:8000/api/payment/callback";


// // =====================================================
// // AUTHENTICATION
// // =====================================================

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
//                 message: "Authentication token required"
//             });
//         }


//         const token =
//             authHeader.split(" ")[1];


//         const decoded =
//             jwt.verify(
//                 token,
//                 process.env.JWT_SECRET
//             );


//         const userId =
//             decoded.userId ||
//             decoded.id ||
//             decoded._id;


//         if (!userId) {

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid authentication token"
//             });
//         }


//         const user =
//             await User.findById(userId);


//         if (!user) {

//             return res.status(401).json({
//                 success: false,
//                 message: "User not found"
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
//             "Payment authentication error:",
//             error.message
//         );

//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token"
//         });
//     }
// }


// // =====================================================
// // CREATE PAYMENT ORDER
// // =====================================================

// router.post(
//     "/create-order",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             // -----------------------------------------
//             // CHECK DITACORE TOKEN
//             // -----------------------------------------

//             if (!DITACORE_USER_TOKEN) {

//                 return res.status(500).json({
//                     success: false,
//                     message:
//                         "DITACORE_USER_TOKEN is missing in .env"
//                 });
//             }


//             // -----------------------------------------
//             // AMOUNT
//             // -----------------------------------------

//             const amount =
//                 Number(req.body.amount);


//             if (
//                 !Number.isFinite(amount) ||
//                 amount <= 0
//             ) {

//                 return res.status(400).json({
//                     success: false,
//                     message: "Valid amount is required"
//                 });
//             }


//             // -----------------------------------------
//             // MOBILE
//             // -----------------------------------------

//             const mobile =
//                 req.user.mobile ||
//                 req.user.phone ||
//                 req.user.mobileNumber ||
//                 req.body.customer_mobile;


//             if (!mobile) {

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         "User mobile number is required"
//                 });
//             }


//             // -----------------------------------------
//             // UNIQUE ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 `ESV${Date.now()}${Math.floor(
//                     Math.random() * 10000
//                 )}`;


//             console.log(
//                 "Creating DITACORE order:",
//                 orderId
//             );


//             console.log(
//                 "Payment User:",
//                 req.user._id.toString()
//             );


//             console.log(
//                 "Payment Amount:",
//                 amount
//             );


//             // -----------------------------------------
//             // CALLBACK URL
//             // -----------------------------------------

//             const callbackUrl =
//                 `${PAYMENT_REDIRECT_URL}?order_id=${encodeURIComponent(
//                     orderId
//                 )}`;


//             // -----------------------------------------
//             // FORM DATA
//             // -----------------------------------------

//             const formData =
//                 new URLSearchParams();


//             formData.append(
//                 "customer_mobile",
//                 String(mobile)
//             );


//             formData.append(
//                 "user_token",
//                 DITACORE_USER_TOKEN
//             );


//             formData.append(
//                 "amount",
//                 amount.toFixed(2)
//             );


//             formData.append(
//                 "order_id",
//                 orderId
//             );


//             formData.append(
//                 "redirect_url",
//                 callbackUrl
//             );


//             formData.append(
//                 "remark1",
//                 "eSeva Wallet Recharge"
//             );


//             formData.append(
//                 "remark2",
//                 String(req.user._id)
//             );


//             // -----------------------------------------
//             // CALL DITACORE
//             // -----------------------------------------

//             const response =
//                 await fetch(
//                     `${DITACORE_BASE_URL}/api/create-order`,
//                     {
//                         method: "POST",

//                         headers: {
//                             "Content-Type":
//                                 "application/x-www-form-urlencoded"
//                         },

//                         body:
//                             formData.toString()
//                     }
//                 );


//             const data =
//                 await response.json();


//             console.log(
//                 "DITACORE response:",
//                 data
//             );


//             // -----------------------------------------
//             // CHECK RESPONSE
//             // -----------------------------------------

//             if (!response.ok) {

//                 return res.status(502).json({
//                     success: false,
//                     message:
//                         "DITACORE payment server returned an error",
//                     gatewayResponse: data
//                 });
//             }


//             // -----------------------------------------
//             // PAYMENT URL
//             // -----------------------------------------

//             const paymentUrl =
//                 data.result?.payment_url ||
//                 data.payment_url ||
//                 data.result?.paymentUrl ||
//                 data.paymentUrl;


//             if (!paymentUrl) {

//                 return res.status(502).json({
//                     success: false,
//                     message:
//                         data.message ||
//                         "Payment URL not received from DITACORE",
//                     gatewayResponse: data
//                 });
//             }


//             // -----------------------------------------
//             // SAVE PAYMENT
//             // -----------------------------------------

//             const payment =
//                 await Payment.create({

//                     orderId,

//                     user:
//                         req.user._id,

//                     amount,

//                     status:
//                         "PENDING",

//                     paymentUrl,

//                     gatewayResponse:
//                         data
//                 });


//             console.log(
//                 "Payment saved in database:",
//                 payment._id
//             );


//             // -----------------------------------------
//             // RESPONSE
//             // -----------------------------------------

//             return res.json({

//                 success: true,

//                 message:
//                     "Payment order created successfully",

//                 orderId,

//                 amount,

//                 paymentUrl
//             });


//         } catch (error) {

//             console.error(
//                 "Create payment order error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to create payment order",

//                 error:
//                     error.message
//             });
//         }
//     }
// );


// // =====================================================
// // CHECK PAYMENT STATUS
// // =====================================================

// router.post(
//     "/check-status",
//     authenticateUser,
//     async (req, res) => {

//         try {

//             // -----------------------------------------
//             // CHECK DITACORE TOKEN
//             // -----------------------------------------

//             if (!DITACORE_USER_TOKEN) {

//                 return res.status(500).json({
//                     success: false,
//                     message:
//                         "DITACORE_USER_TOKEN is missing in .env"
//                 });
//             }


//             // -----------------------------------------
//             // ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 String(
//                     req.body.order_id || ""
//                 ).trim();


//             if (!orderId) {

//                 return res.status(400).json({
//                     success: false,
//                     message:
//                         "order_id is required"
//                 });
//             }


//             // -----------------------------------------
//             // FIND PAYMENT
//             // -----------------------------------------

//             const payment =
//                 await Payment.findOne({
//                     orderId
//                 });


//             if (!payment) {

//                 return res.status(404).json({
//                     success: false,
//                     message:
//                         "Payment order not found"
//                 });
//             }


//             // -----------------------------------------
//             // SECURITY CHECK
//             // -----------------------------------------

//             if (
//                 String(payment.user) !==
//                 String(req.user._id)
//             ) {

//                 return res.status(403).json({
//                     success: false,
//                     message:
//                         "This payment does not belong to the logged-in user"
//                 });
//             }


//             // -----------------------------------------
//             // CHECK ALREADY CREDITED
//             // -----------------------------------------

//             const existingTransaction =
//                 await WalletTransaction.findOne({

//                     user:
//                         req.user._id,

//                     type:
//                         "CREDIT",

//                     referenceId:
//                         orderId,

//                     status:
//                         "SUCCESS"
//                 });


//             if (existingTransaction) {

//                 const wallet =
//                     await Wallet.findOne({
//                         user:
//                             req.user._id
//                     });


//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "SUCCESS",

//                     message:
//                         "Payment already credited",

//                     alreadyCredited:
//                         true,

//                     wallet: {

//                         balance:
//                             wallet?.balance || 0
//                     },

//                     transaction:
//                         existingTransaction
//                 });
//             }


//             // -----------------------------------------
//             // FORM DATA
//             // -----------------------------------------

//             const formData =
//                 new URLSearchParams();


//             formData.append(
//                 "user_token",
//                 DITACORE_USER_TOKEN
//             );


//             formData.append(
//                 "order_id",
//                 orderId
//             );


//             // -----------------------------------------
//             // CHECK DITACORE STATUS
//             // -----------------------------------------

//             const response =
//                 await fetch(
//                     `${DITACORE_BASE_URL}/api/check-order-status`,
//                     {
//                         method: "POST",

//                         headers: {
//                             "Content-Type":
//                                 "application/x-www-form-urlencoded"
//                         },

//                         body:
//                             formData.toString()
//                     }
//                 );


//             const data =
//                 await response.json();


//             console.log(
//                 "DITACORE status response:",
//                 data
//             );


//             // =================================================
//             // IMPORTANT STATUS HANDLING
//             // =================================================
//             //
//             // DITACORE may return something like:
//             //
//             // status: "FAILURE"
//             //
//             // result:
//             // {
//             //     txnStatus: "FAILURE",
//             //     status: "PENDING"
//             // }
//             //
//             // In this case payment is NOT treated as failed.
//             // PENDING has priority.
//             //
//             // Wallet is credited ONLY when we get a real
//             // SUCCESS / COMPLETED response.
//             // =================================================


//             const gatewayStatus =
//                 String(
//                     data.status || ""
//                 ).toUpperCase();


//             const transactionStatus =
//                 String(
//                     data.result?.txnStatus || ""
//                 ).toUpperCase();


//             const resultStatus =
//                 String(
//                     data.result?.status || ""
//                 ).toUpperCase();


//             const paymentStatus =
//                 String(
//                     data.result?.payment_status ||
//                     data.payment_status ||
//                     data.order_status ||
//                     ""
//                 ).toUpperCase();


//             // -----------------------------------------
//             // SUCCESS
//             // -----------------------------------------

//             const isSuccess =
//                 gatewayStatus === "COMPLETED" ||

//                 transactionStatus === "COMPLETED" ||

//                 resultStatus === "SUCCESS" ||

//                 paymentStatus === "COMPLETED" ||

//                 paymentStatus === "SUCCESS" ||

//                 paymentStatus === "PAID";


//             // -----------------------------------------
//             // PENDING
//             // -----------------------------------------

//             const isPending =
//                 gatewayStatus === "PENDING" ||

//                 transactionStatus === "PENDING" ||

//                 resultStatus === "PENDING" ||

//                 paymentStatus === "PENDING";


//             // -----------------------------------------
//             // FAILED
//             // -----------------------------------------

//             const isFailed =
//                 (
//                     gatewayStatus === "FAILED" ||
//                     gatewayStatus === "FAILURE" ||
//                     gatewayStatus === "ERROR" ||
//                     gatewayStatus === "CANCELLED" ||
//                     gatewayStatus === "REJECTED" ||

//                     transactionStatus === "FAILED" ||
//                     transactionStatus === "FAILURE" ||
//                     transactionStatus === "ERROR" ||
//                     transactionStatus === "CANCELLED" ||
//                     transactionStatus === "REJECTED" ||

//                     resultStatus === "FAILED" ||
//                     resultStatus === "FAILURE" ||
//                     resultStatus === "ERROR" ||
//                     resultStatus === "CANCELLED" ||
//                     resultStatus === "REJECTED" ||

//                     paymentStatus === "FAILED" ||
//                     paymentStatus === "FAILURE" ||
//                     paymentStatus === "ERROR" ||
//                     paymentStatus === "CANCELLED" ||
//                     paymentStatus === "REJECTED"
//                 )

//                 && !isPending
//                 && !isSuccess;


//             // =================================================
//             // PENDING
//             // =================================================

//             if (isPending) {

//                 payment.status =
//                     "PENDING";


//                 payment.gatewayResponse =
//                     data;


//                 await payment.save();


//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "PENDING",

//                     message:
//                         "Payment is still pending",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // =================================================
//             // FAILED
//             // =================================================

//             if (isFailed) {

//                 payment.status =
//                     "FAILED";


//                 payment.gatewayResponse =
//                     data;


//                 await payment.save();


//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "FAILED",

//                     message:
//                         "Payment failed",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // =================================================
//             // UNKNOWN STATUS
//             // =================================================
//             //
//             // If gateway gives some unknown status,
//             // do NOT credit wallet.
//             //
//             // Keep payment pending and allow frontend
//             // polling to check again.
//             // =================================================

//             if (!isSuccess) {

//                 payment.status =
//                     "PENDING";


//                 payment.gatewayResponse =
//                     data;


//                 await payment.save();


//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "PENDING",

//                     message:
//                         "Payment is still pending",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // =================================================
//             // PAYMENT SUCCESS
//             // =================================================
//             //
//             // From this point onward we know the gateway
//             // has confirmed SUCCESS / COMPLETED.
//             // =================================================


//             // -----------------------------------------
//             // GET PAID AMOUNT
//             // -----------------------------------------

//             const paidAmount =
//                 Number(

//                     data.result?.amount ||

//                     data.amount ||

//                     data.result?.paid_amount ||

//                     data.paid_amount ||

//                     payment.amount
//                 );


//             if (
//                 !Number.isFinite(paidAmount) ||
//                 paidAmount <= 0
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Payment successful but valid amount was not received from gateway",

//                     gatewayResponse:
//                         data
//                 });
//             }


//             // -----------------------------------------
//             // AMOUNT SECURITY CHECK
//             // -----------------------------------------

//             if (
//                 paidAmount !==
//                 Number(payment.amount)
//             ) {

//                 console.error(
//                     "Payment amount mismatch:",
//                     {
//                         orderId,

//                         expected:
//                             payment.amount,

//                         received:
//                             paidAmount
//                     }
//                 );


//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Payment amount mismatch",

//                     expectedAmount:
//                         payment.amount,

//                     receivedAmount:
//                         paidAmount
//                 });
//             }


//             // -----------------------------------------
//             // GET WALLET
//             // -----------------------------------------

//             let wallet =
//                 await Wallet.findOne({

//                     user:
//                         payment.user
//                 });


//             // -----------------------------------------
//             // CREATE WALLET IF NOT EXISTS
//             // -----------------------------------------

//             if (!wallet) {

//                 wallet =
//                     await Wallet.create({

//                         user:
//                             payment.user,

//                         balance:
//                             0
//                     });
//             }


//             // -----------------------------------------
//             // SECOND DUPLICATE CHECK
//             // -----------------------------------------

//             const duplicate =
//                 await WalletTransaction.findOne({

//                     user:
//                         payment.user,

//                     type:
//                         "CREDIT",

//                     referenceId:
//                         orderId
//                 });


//             if (duplicate) {

//                 payment.status =
//                     "COMPLETED";


//                 payment.creditedAt =
//                     payment.creditedAt ||
//                     new Date();


//                 payment.gatewayResponse =
//                     data;


//                 await payment.save();


//                 return res.json({

//                     success: true,

//                     paymentStatus:
//                         "SUCCESS",

//                     message:
//                         "Payment already processed",

//                     wallet: {

//                         balance:
//                             wallet.balance
//                     },

//                     transaction:
//                         duplicate
//                 });
//             }


//             // -----------------------------------------
//             // CREDIT WALLET
//             // -----------------------------------------

//             const balanceBefore =
//                 wallet.balance;


//             wallet.balance =
//                 wallet.balance +
//                 paidAmount;


//             await wallet.save();


//             // -----------------------------------------
//             // SAVE WALLET TRANSACTION
//             // -----------------------------------------

//             const transaction =
//                 await WalletTransaction.create({

//                     user:
//                         payment.user,

//                     type:
//                         "CREDIT",

//                     amount:
//                         paidAmount,

//                     balanceBefore,

//                     balanceAfter:
//                         wallet.balance,

//                     reason:
//                         "DITACORE Wallet Recharge",

//                     status:
//                         "SUCCESS",

//                     referenceId:
//                         orderId
//                 });


//             // -----------------------------------------
//             // UPDATE PAYMENT
//             // -----------------------------------------

//             payment.status =
//                 "COMPLETED";


//             payment.creditedAt =
//                 new Date();


//             payment.gatewayResponse =
//                 data;


//             await payment.save();


//             // -----------------------------------------
//             // FINAL RESPONSE
//             // -----------------------------------------

//             return res.json({

//                 success: true,

//                 paymentStatus:
//                     "SUCCESS",

//                 message:
//                     "Payment successful and wallet credited",

//                 orderId,

//                 amount:
//                     paidAmount,

//                 wallet: {

//                     balance:
//                         wallet.balance
//                 },

//                 transaction
//             });


//         } catch (error) {

//             console.error(
//                 "Payment status error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to check payment status",

//                 error:
//                     error.message
//             });
//         }
//     }
// );


// // =====================================================
// // PAYMENT CALLBACK
// // =====================================================

// router.all(
//     "/callback",
//     async (req, res) => {

//         try {

//             console.log(
//                 "========== PAYMENT CALLBACK =========="
//             );


//             console.log(
//                 "Method:",
//                 req.method
//             );


//             console.log(
//                 "Query:",
//                 req.query
//             );


//             console.log(
//                 "Body:",
//                 req.body
//             );


//             console.log(
//                 "======================================"
//             );


//             // -----------------------------------------
//             // GET ORDER ID
//             // -----------------------------------------

//             const orderId =
//                 req.query.order_id ||
//                 req.query.orderId ||
//                 req.body?.order_id ||
//                 req.body?.orderId;


//             if (!orderId) {

//                 console.log(
//                     "❌ Payment callback: Order ID missing"
//                 );


//                 return res.status(400).send(
//                     "Payment callback received but order ID is missing."
//                 );
//             }


//             console.log(
//                 "✅ Payment callback Order ID:",
//                 orderId
//             );


//             // -----------------------------------------
//             // FIND PAYMENT
//             // -----------------------------------------

//             const payment =
//                 await Payment.findOne({
//                     orderId
//                 });


//             if (!payment) {

//                 return res.status(404).send(
//                     "Payment order not found."
//                 );
//             }


//             // -----------------------------------------
//             // CALLBACK PAGE
//             // -----------------------------------------

//             return res.send(`

//                 <!DOCTYPE html>

//                 <html>

//                 <head>

//                     <title>
//                         Payment Processing
//                     </title>

//                     <meta
//                         name="viewport"
//                         content="width=device-width, initial-scale=1"
//                     >

//                 </head>


//                 <body
//                     style="
//                         font-family: Arial;
//                         text-align: center;
//                         padding: 50px;
//                     "
//                 >

//                     <h2>
//                         Payment Received
//                     </h2>

//                     <p>
//                         Your payment is being verified.
//                     </p>

//                     <p>
//                         Order ID:
//                         <strong>
//                             ${orderId}
//                         </strong>
//                     </p>

//                     <p>
//                         Payment status is being checked.
//                     </p>

//                     <p>
//                         Please return to eSeva
//                         and check your wallet balance.
//                     </p>

//                 </body>

//                 </html>

//             `);


//         } catch (error) {

//             console.error(
//                 "Payment callback error:",
//                 error
//             );


//             return res.status(500).send(
//                 "Payment callback failed."
//             );
//         }
//     }
// );


// // =====================================================
// // EXPORT
// // =====================================================

// export default router;





import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";
import Payment from "../models/Payment.js";

const router = express.Router();


// =====================================================
// CONFIG
// =====================================================

const DITACORE_BASE_URL =
    process.env.DITACORE_BASE_URL ||
    "https://api.ditacore.com";

const DITACORE_USER_TOKEN =
    process.env.DITACORE_USER_TOKEN;

const PAYMENT_REDIRECT_URL =
    process.env.PAYMENT_REDIRECT_URL ||
    "http://localhost:8000/api/payment/callback";


// =====================================================
// AUTHENTICATION
// =====================================================

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
                message: "Authentication token required"
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
                message: "Invalid authentication token"
            });
        }

        const user =
            await User.findById(userId);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User not found"
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
            "Payment authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}


// =====================================================
// CREATE PAYMENT ORDER
// =====================================================

router.post(
    "/create-order",
    authenticateUser,
    async (req, res) => {

        try {

            if (!DITACORE_USER_TOKEN) {

                return res.status(500).json({
                    success: false,
                    message:
                        "DITACORE_USER_TOKEN is missing in .env"
                });
            }


            // -----------------------------------------
            // AMOUNT
            // -----------------------------------------

            const amount =
                Number(req.body.amount);

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Valid amount is required"
                });
            }


            // -----------------------------------------
            // MOBILE
            // -----------------------------------------

            const mobile =
                req.user.mobile ||
                req.user.phone ||
                req.user.mobileNumber ||
                req.body.customer_mobile;

            if (!mobile) {

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
                    Math.random() * 10000
                )}`;

            console.log(
                "Creating DITACORE order:",
                orderId
            );

            console.log(
                "Payment User:",
                req.user._id.toString()
            );

            console.log(
                "Payment Amount:",
                amount
            );


            // -----------------------------------------
            // CALLBACK URL
            // -----------------------------------------

            const callbackUrl =
                `${PAYMENT_REDIRECT_URL}?order_id=${encodeURIComponent(
                    orderId
                )}`;


            // -----------------------------------------
            // FORM DATA
            // -----------------------------------------

            const formData =
                new URLSearchParams();

            formData.append(
                "customer_mobile",
                String(mobile)
            );

            formData.append(
                "user_token",
                DITACORE_USER_TOKEN
            );

            formData.append(
                "amount",
                amount.toFixed(2)
            );

            formData.append(
                "order_id",
                orderId
            );

            formData.append(
                "redirect_url",
                callbackUrl
            );

            formData.append(
                "remark1",
                "eSeva Wallet Recharge"
            );

            formData.append(
                "remark2",
                String(req.user._id)
            );


            // -----------------------------------------
            // CALL DITACORE
            // -----------------------------------------

            const response =
                await fetch(
                    `${DITACORE_BASE_URL}/api/create-order`,
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
                "DITACORE response:",
                data
            );


            // -----------------------------------------
            // CHECK RESPONSE
            // -----------------------------------------

            if (!response.ok) {

                return res.status(502).json({
                    success: false,
                    message:
                        "DITACORE payment server returned an error",
                    gatewayResponse: data
                });
            }


            // -----------------------------------------
            // PAYMENT URL
            // -----------------------------------------

            const paymentUrl =
                data.result?.payment_url ||
                data.payment_url ||
                data.result?.paymentUrl ||
                data.paymentUrl;


            if (!paymentUrl) {

                return res.status(502).json({
                    success: false,
                    message:
                        data.message ||
                        "Payment URL not received from DITACORE",
                    gatewayResponse: data
                });
            }


            // -----------------------------------------
            // SAVE PAYMENT
            // -----------------------------------------

            const payment =
                await Payment.create({

                    orderId,

                    user:
                        req.user._id,

                    amount,

                    status:
                        "PENDING",

                    paymentUrl,

                    gatewayResponse:
                        data
                });


            console.log(
                "Payment saved in database:",
                payment._id
            );


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            return res.json({

                success: true,

                message:
                    "Payment order created successfully",

                orderId,

                amount,

                paymentUrl
            });


        } catch (error) {

            console.error(
                "Create payment order error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to create payment order",

                error:
                    error.message
            });
        }
    }
);


// =====================================================
// CHECK PAYMENT STATUS
// =====================================================

router.post(
    "/check-status",
    authenticateUser,
    async (req, res) => {

        try {

            // -----------------------------------------
            // CHECK TOKEN
            // -----------------------------------------

            if (!DITACORE_USER_TOKEN) {

                return res.status(500).json({
                    success: false,
                    message:
                        "DITACORE_USER_TOKEN is missing in .env"
                });
            }


            // -----------------------------------------
            // ORDER ID
            // -----------------------------------------

            const orderId =
                String(
                    req.body.order_id || ""
                ).trim();


            if (!orderId) {

                return res.status(400).json({
                    success: false,
                    message:
                        "order_id is required"
                });
            }


            // -----------------------------------------
            // FIND PAYMENT
            // -----------------------------------------

            const payment =
                await Payment.findOne({
                    orderId
                });


            if (!payment) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Payment order not found"
                });
            }


            // -----------------------------------------
            // SECURITY CHECK
            // -----------------------------------------

            if (
                String(payment.user) !==
                String(req.user._id)
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        "This payment does not belong to the logged-in user"
                });
            }


            // -----------------------------------------
            // ALREADY CREDITED CHECK
            // -----------------------------------------

            const existingTransaction =
                await WalletTransaction.findOne({

                    user:
                        req.user._id,

                    type:
                        "CREDIT",

                    referenceId:
                        orderId,

                    status:
                        "SUCCESS"
                });


            if (existingTransaction) {

                const wallet =
                    await Wallet.findOne({
                        user:
                            req.user._id
                    });

                return res.json({

                    success: true,

                    paymentStatus:
                        "SUCCESS",

                    message:
                        "Payment already credited",

                    alreadyCredited:
                        true,

                    wallet: {

                        balance:
                            wallet?.balance || 0
                    },

                    transaction:
                        existingTransaction
                });
            }


            // -----------------------------------------
            // DITACORE STATUS REQUEST
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
                    `${DITACORE_BASE_URL}/api/check-order-status`,
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
                "DITACORE status response:",
                data
            );


            // =====================================================
            // STATUS DETECTION
            // =====================================================

            const gatewayStatus =
                String(
                    data.status || ""
                ).toUpperCase();


            const transactionStatus =
                String(
                    data.result?.txnStatus || ""
                ).toUpperCase();


            const resultStatus =
                String(
                    data.result?.status || ""
                ).toUpperCase();


            const paymentStatus =
                String(
                    data.result?.payment_status ||
                    data.payment_status ||
                    data.order_status ||
                    ""
                ).toUpperCase();


            console.log(
                "Gateway Status:",
                gatewayStatus
            );

            console.log(
                "Transaction Status:",
                transactionStatus
            );

            console.log(
                "Result Status:",
                resultStatus
            );

            console.log(
                "Payment Status:",
                paymentStatus
            );


            // =====================================================
            // SUCCESS
            // =====================================================

            const isSuccess =
                gatewayStatus === "COMPLETED" ||
                transactionStatus === "COMPLETED" ||
                resultStatus === "SUCCESS" ||
                paymentStatus === "COMPLETED" ||
                paymentStatus === "SUCCESS" ||
                paymentStatus === "PAID";


            // =====================================================
            // PENDING
            // =====================================================

            const isPending =
                gatewayStatus === "PENDING" ||
                transactionStatus === "PENDING" ||
                resultStatus === "PENDING" ||
                paymentStatus === "PENDING";


            // =====================================================
            // FAILED
            // =====================================================

            const isFailed =
                (
                    gatewayStatus === "FAILED" ||
                    gatewayStatus === "FAILURE" ||
                    gatewayStatus === "ERROR" ||
                    gatewayStatus === "CANCELLED" ||
                    gatewayStatus === "REJECTED" ||

                    transactionStatus === "FAILED" ||
                    transactionStatus === "FAILURE" ||
                    transactionStatus === "ERROR" ||
                    transactionStatus === "CANCELLED" ||
                    transactionStatus === "REJECTED" ||

                    resultStatus === "FAILED" ||
                    resultStatus === "FAILURE" ||
                    resultStatus === "ERROR" ||
                    resultStatus === "CANCELLED" ||
                    resultStatus === "REJECTED" ||

                    paymentStatus === "FAILED" ||
                    paymentStatus === "FAILURE" ||
                    paymentStatus === "ERROR" ||
                    paymentStatus === "CANCELLED" ||
                    paymentStatus === "REJECTED"
                )
                &&
                !isPending
                &&
                !isSuccess;


            // =====================================================
            // PENDING
            // =====================================================

            if (isPending) {

                payment.status =
                    "PENDING";

                payment.gatewayResponse =
                    data;

                await payment.save();


                return res.json({

                    success: true,

                    paymentStatus:
                        "PENDING",

                    message:
                        "Payment is still pending",

                    gatewayResponse:
                        data
                });
            }


            // =====================================================
            // FAILED
            // =====================================================

            if (isFailed) {

                payment.status =
                    "FAILED";

                payment.gatewayResponse =
                    data;

                await payment.save();


                return res.json({

                    success: true,

                    paymentStatus:
                        "FAILED",

                    message:
                        "Payment failed",

                    gatewayResponse:
                        data
                });
            }


            // =====================================================
            // UNKNOWN STATUS
            // =====================================================

            if (!isSuccess) {

                payment.status =
                    "PENDING";

                payment.gatewayResponse =
                    data;

                await payment.save();


                return res.json({

                    success: true,

                    paymentStatus:
                        "PENDING",

                    message:
                        "Payment is still pending",

                    gatewayResponse:
                        data
                });
            }


            // =====================================================
            // SUCCESS CONFIRMED
            // =====================================================

            console.log(
                "✅ DITACORE PAYMENT SUCCESS:",
                orderId
            );


            // -----------------------------------------
            // GET PAID AMOUNT
            // -----------------------------------------

            const paidAmount =
                Number(

                    data.result?.amount ||

                    data.amount ||

                    data.result?.paid_amount ||

                    data.paid_amount ||

                    payment.amount
                );


            if (
                !Number.isFinite(paidAmount) ||
                paidAmount <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Payment successful but valid amount was not received from gateway",

                    gatewayResponse:
                        data
                });
            }


            // -----------------------------------------
            // AMOUNT SECURITY CHECK
            // -----------------------------------------

            if (
                paidAmount !==
                Number(payment.amount)
            ) {

                console.error(
                    "❌ Payment amount mismatch:",
                    {
                        orderId,
                        expected:
                            payment.amount,
                        received:
                            paidAmount
                    }
                );


                return res.status(400).json({

                    success: false,

                    message:
                        "Payment amount mismatch",

                    expectedAmount:
                        payment.amount,

                    receivedAmount:
                        paidAmount
                });
            }


            // -----------------------------------------
            // GET WALLET
            // -----------------------------------------

            let wallet =
                await Wallet.findOne({

                    user:
                        payment.user
                });


            // -----------------------------------------
            // CREATE WALLET IF NOT EXISTS
            // -----------------------------------------

            if (!wallet) {

                wallet =
                    await Wallet.create({

                        user:
                            payment.user,

                        balance:
                            0
                    });
            }


            // -----------------------------------------
            // DUPLICATE TRANSACTION CHECK
            // -----------------------------------------

            const duplicate =
                await WalletTransaction.findOne({

                    user:
                        payment.user,

                    type:
                        "CREDIT",

                    referenceId:
                        orderId
                });


            if (duplicate) {

                payment.status =
                    "COMPLETED";

                payment.creditedAt =
                    payment.creditedAt ||
                    new Date();

                payment.gatewayResponse =
                    data;

                await payment.save();


                return res.json({

                    success: true,

                    paymentStatus:
                        "SUCCESS",

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


            // =====================================================
            // CREDIT WALLET
            // =====================================================

            const balanceBefore =
                wallet.balance;


            wallet.balance =
                wallet.balance +
                paidAmount;


            await wallet.save();


            console.log(
                "💰 Wallet credited:",
                {
                    user:
                        payment.user.toString(),

                    orderId,

                    amount:
                        paidAmount,

                    balanceBefore,

                    balanceAfter:
                        wallet.balance
                }
            );


            // -----------------------------------------
            // SAVE TRANSACTION
            // -----------------------------------------

            const transaction =
                await WalletTransaction.create({

                    user:
                        payment.user,

                    type:
                        "CREDIT",

                    amount:
                        paidAmount,

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
            // UPDATE PAYMENT
            // -----------------------------------------

            payment.status =
                "COMPLETED";

            payment.creditedAt =
                new Date();

            payment.gatewayResponse =
                data;

            await payment.save();


            // -----------------------------------------
            // FINAL RESPONSE
            // -----------------------------------------

            return res.json({

                success: true,

                paymentStatus:
                    "SUCCESS",

                message:
                    "Payment successful and wallet credited",

                orderId,

                amount:
                    paidAmount,

                wallet: {

                    balance:
                        wallet.balance
                },

                transaction
            });


        } catch (error) {

            console.error(
                "Payment status error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to check payment status",

                error:
                    error.message
            });
        }
    }
);


// =====================================================
// PAYMENT CALLBACK
// =====================================================

router.all(
    "/callback",
    async (req, res) => {

        try {

            console.log(
                "========== PAYMENT CALLBACK =========="
            );

            console.log(
                "Method:",
                req.method
            );

            console.log(
                "Query:",
                req.query
            );

            console.log(
                "Body:",
                req.body
            );

            console.log(
                "======================================"
            );


            // -----------------------------------------
            // GET ORDER ID
            // -----------------------------------------

            const orderId =
                req.query.order_id ||
                req.query.orderId ||
                req.body?.order_id ||
                req.body?.orderId;


            if (!orderId) {

                console.log(
                    "❌ Payment callback: Order ID missing"
                );


                return res.status(400).send(
                    "Payment callback received but order ID is missing."
                );
            }


            console.log(
                "✅ Payment callback Order ID:",
                orderId
            );


            // -----------------------------------------
            // FIND PAYMENT
            // -----------------------------------------

            const payment =
                await Payment.findOne({
                    orderId
                });


            if (!payment) {

                return res.status(404).send(
                    "Payment order not found."
                );
            }


            // -----------------------------------------
            // CALLBACK PAGE
            // -----------------------------------------

            return res.send(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        Payment Processing
                    </title>

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    >

                </head>


                <body
                    style="
                        font-family: Arial;
                        text-align: center;
                        padding: 50px;
                    "
                >

                    <h2>
                        Payment Received
                    </h2>

                    <p>
                        Your payment is being verified.
                    </p>

                    <p>
                        Order ID:
                        <strong>
                            ${orderId}
                        </strong>
                    </p>

                    <p>
                        Please return to eSeva.
                    </p>

                    <p>
                        Your wallet will be updated
                        after payment verification.
                    </p>

                </body>

                </html>

            `);


        } catch (error) {

            console.error(
                "Payment callback error:",
                error
            );


            return res.status(500).send(
                "Payment callback failed."
            );
        }
    }
);


// =====================================================
// EXPORT
// =====================================================

export default router;