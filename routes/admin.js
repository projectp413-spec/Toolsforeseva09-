


// import express from "express";

// import User from "../models/User.js";
// import Service from "../models/Service.js";
// import ServiceUsage from "../models/ServiceUsage.js";

// import adminMiddleware from "../middleware/adminMiddleware.js";


// const router = express.Router();


// // =====================================
// // ADMIN DASHBOARD
// // =====================================

// router.get(
//     "/dashboard",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const totalUsers =
//                 await User.countDocuments();


//             const verifiedUsers =
//                 await User.countDocuments({
//                     emailVerified: true
//                 });


//             const unverifiedUsers =
//                 await User.countDocuments({
//                     emailVerified: false
//                 });


//             const admins =
//                 await User.countDocuments({
//                     role: "admin"
//                 });


//             const recentUsers =
//                 await User.find()
//                     .select(
//                         "name email role emailVerified isBlocked createdAt"
//                     )
//                     .sort({
//                         createdAt: -1
//                     })
//                     .limit(5);


//             return res.json({

//                 success: true,

//                 data: {

//                     totalUsers,

//                     verifiedUsers,

//                     unverifiedUsers,

//                     admins,

//                     recentUsers

//                 }

//             });


//         } catch (error) {

//             console.error(
//                 "Admin dashboard error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to load dashboard"

//             });

//         }

//     }
// );


// // =====================================
// // GET ALL USERS
// // =====================================

// router.get(
//     "/users",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const users =
//                 await User.find()
//                     .select(
//                         "name email role emailVerified isBlocked walletBalance createdAt"
//                     )
//                     .sort({
//                         createdAt: -1
//                     });


//             return res.json({

//                 success: true,

//                 count: users.length,

//                 users

//             });


//         } catch (error) {

//             console.error(
//                 "Get users error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch users"

//             });

//         }

//     }
// );


// // =====================================
// // GET SINGLE USER
// // =====================================

// router.get(
//     "/users/:id",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const user =
//                 await User.findById(
//                     req.params.id
//                 ).select(
//                     "-password -otpHash"
//                 );


//             if (!user) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "User not found"

//                 });

//             }


//             return res.json({

//                 success: true,

//                 user

//             });


//         } catch (error) {

//             console.error(
//                 "Get user error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch user"

//             });

//         }

//     }
// );


// // =====================================
// // BLOCK USER
// // =====================================

// router.patch(
//     "/users/:id/block",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const user =
//                 await User.findById(
//                     req.params.id
//                 );


//             if (!user) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "User not found"

//                 });

//             }


//             // Admin cannot be blocked

//             if (
//                 user.role === "admin"
//             ) {

//                 return res.status(403).json({

//                     success: false,

//                     message:
//                         "Admin account cannot be blocked"

//                 });

//             }


//             user.isBlocked = true;

//             await user.save();


//             return res.json({

//                 success: true,

//                 message:
//                     "User blocked successfully",

//                 user: {

//                     id:
//                         user._id,

//                     name:
//                         user.name,

//                     email:
//                         user.email,

//                     isBlocked:
//                         user.isBlocked

//                 }

//             });


//         } catch (error) {

//             console.error(
//                 "Block user error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to block user"

//             });

//         }

//     }
// );


// // =====================================
// // UNBLOCK USER
// // =====================================

// router.patch(
//     "/users/:id/unblock",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const user =
//                 await User.findById(
//                     req.params.id
//                 );


//             if (!user) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "User not found"

//                 });

//             }


//             user.isBlocked = false;

//             await user.save();


//             return res.json({

//                 success: true,

//                 message:
//                     "User unblocked successfully",

//                 user: {

//                     id:
//                         user._id,

//                     name:
//                         user.name,

//                     email:
//                         user.email,

//                     isBlocked:
//                         user.isBlocked

//                 }

//             });


//         } catch (error) {

//             console.error(
//                 "Unblock user error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to unblock user"

//             });

//         }

//     }
// );


// // =====================================
// // GET ALL SERVICES
// // =====================================

// router.get(
//     "/services",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const services =
//                 await Service.find()
//                     .sort({
//                         category: 1,
//                         name: 1
//                     });


//             return res.json({

//                 success: true,

//                 count: services.length,

//                 services

//             });


//         } catch (error) {

//             console.error(
//                 "Get services error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch services"

//             });

//         }

//     }
// );


// // =====================================
// // GET SINGLE SERVICE
// // =====================================

// router.get(
//     "/services/:id",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const service =
//                 await Service.findById(
//                     req.params.id
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             return res.json({

//                 success: true,

//                 service

//             });


//         } catch (error) {

//             console.error(
//                 "Get service error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch service"

//             });

//         }

//     }
// );


// // =====================================
// // CREATE SERVICE
// // =====================================

// router.post(
//     "/services",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const {
//                 name,
//                 category,
//                 price,
//                 isAvailable
//             } = req.body;


//             if (
//                 !name ||
//                 !category ||
//                 price === undefined
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Name, category and price are required"

//                 });

//             }


//             if (
//                 isNaN(price) ||
//                 Number(price) < 0
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Please provide a valid price"

//                 });

//             }


//             const existingService =
//                 await Service.findOne({

//                     name:
//                         name.trim()

//                 });


//             if (existingService) {

//                 return res.status(409).json({

//                     success: false,

//                     message:
//                         "Service already exists"

//                 });

//             }


//             const service =
//                 await Service.create({

//                     name:
//                         name.trim(),

//                     category:
//                         category.trim(),

//                     price:
//                         Number(price),

//                     isAvailable:
//                         typeof isAvailable ===
//                         "boolean"
//                             ? isAvailable
//                             : true

//                 });


//             return res.status(201).json({

//                 success: true,

//                 message:
//                     "Service created successfully",

//                 service

//             });


//         } catch (error) {

//             console.error(
//                 "Create service error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to create service"

//             });

//         }

//     }
// );


// // =====================================
// // UPDATE SERVICE PRICE
// // =====================================

// router.patch(
//     "/services/:id/price",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const {
//                 price
//             } = req.body;


//             if (
//                 price === undefined ||
//                 price === null ||
//                 isNaN(price) ||
//                 Number(price) < 0
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "Please provide a valid price"

//                 });

//             }


//             const service =
//                 await Service.findById(
//                     req.params.id
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             service.price =
//                 Number(price);


//             await service.save();


//             return res.json({

//                 success: true,

//                 message:
//                     "Service price updated successfully",

//                 service

//             });


//         } catch (error) {

//             console.error(
//                 "Update service price error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to update service price"

//             });

//         }

//     }
// );


// // =====================================
// // ENABLE / DISABLE SERVICE
// // =====================================

// router.patch(
//     "/services/:id/status",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const {
//                 isAvailable
//             } = req.body;


//             if (
//                 typeof isAvailable !==
//                 "boolean"
//             ) {

//                 return res.status(400).json({

//                     success: false,

//                     message:
//                         "isAvailable must be true or false"

//                 });

//             }


//             const service =
//                 await Service.findById(
//                     req.params.id
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             service.isAvailable =
//                 isAvailable;


//             await service.save();


//             return res.json({

//                 success: true,

//                 message:
//                     isAvailable
//                         ? "Service enabled successfully"
//                         : "Service disabled successfully",

//                 service

//             });


//         } catch (error) {

//             console.error(
//                 "Update service status error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to update service status"

//             });

//         }

//     }
// );


// // =====================================
// // UPDATE COMPLETE SERVICE
// // =====================================

// router.put(
//     "/services/:id",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const {
//                 name,
//                 category,
//                 price,
//                 isAvailable
//             } = req.body;


//             const service =
//                 await Service.findById(
//                     req.params.id
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             if (
//                 name !== undefined
//             ) {

//                 service.name =
//                     name.trim();

//             }


//             if (
//                 category !== undefined
//             ) {

//                 service.category =
//                     category.trim();

//             }


//             if (
//                 price !== undefined
//             ) {

//                 if (
//                     isNaN(price) ||
//                     Number(price) < 0
//                 ) {

//                     return res.status(400).json({

//                         success: false,

//                         message:
//                             "Please provide a valid price"

//                     });

//                 }


//                 service.price =
//                     Number(price);

//             }


//             if (
//                 isAvailable !== undefined
//             ) {

//                 if (
//                     typeof isAvailable !==
//                     "boolean"
//                 ) {

//                     return res.status(400).json({

//                         success: false,

//                         message:
//                             "isAvailable must be true or false"

//                     });

//                 }


//                 service.isAvailable =
//                     isAvailable;

//             }


//             await service.save();


//             return res.json({

//                 success: true,

//                 message:
//                     "Service updated successfully",

//                 service

//             });


//         } catch (error) {

//             console.error(
//                 "Update service error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to update service"

//             });

//         }

//     }
// );


// // =====================================
// // DELETE SERVICE
// // =====================================

// router.delete(
//     "/services/:id",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const service =
//                 await Service.findById(
//                     req.params.id
//                 );


//             if (!service) {

//                 return res.status(404).json({

//                     success: false,

//                     message:
//                         "Service not found"

//                 });

//             }


//             await Service.findByIdAndDelete(
//                 req.params.id
//             );


//             return res.json({

//                 success: true,

//                 message:
//                     "Service deleted successfully"

//             });


//         } catch (error) {

//             console.error(
//                 "Delete service error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to delete service"

//             });

//         }

//     }
// );


// // =====================================
// // GET SERVICE USAGE HISTORY
// // =====================================

// router.get(
//     "/service-usage",
//     adminMiddleware,
//     async (req, res) => {

//         try {

//             const usage =
//                 await ServiceUsage.find()
//                     .populate(
//                         "user",
//                         "name email"
//                     )
//                     .sort({
//                         createdAt: -1
//         });


//             return res.json({

//                 success: true,

//                 count:
//                     usage.length,

//                 usage

//             });


//         } catch (error) {

//             console.error(
//                 "Service usage error:",
//                 error
//             );


//             return res.status(500).json({

//                 success: false,

//                 message:
//                     "Failed to fetch service usage"

//             });

//         }

//     }
// );


// export default router;







import express from "express";

import User from "../models/User.js";
import Service from "../models/Service.js";
import ServiceUsage from "../models/ServiceUsage.js";
import RequestService from "../models/RequestService.js";

import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


// =====================================
// ADMIN DASHBOARD
// =====================================

router.get(
    "/dashboard",
    adminMiddleware,
    async (req, res) => {

        try {

            const totalUsers =
                await User.countDocuments();

            const verifiedUsers =
                await User.countDocuments({
                    emailVerified: true
                });

            const unverifiedUsers =
                await User.countDocuments({
                    emailVerified: false
                });

            const admins =
                await User.countDocuments({
                    role: "admin"
                });

            const recentUsers =
                await User.find()
                    .select(
                        "name email role emailVerified isBlocked createdAt"
                    )
                    .sort({
                        createdAt: -1
                    })
                    .limit(5);

            return res.json({

                success: true,

                data: {

                    totalUsers,

                    verifiedUsers,

                    unverifiedUsers,

                    admins,

                    recentUsers

                }

            });

        } catch (error) {

            console.error(
                "Admin dashboard error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load dashboard"

            });

        }

    }
);


// =====================================
// GET ALL USERS
// =====================================

router.get(
    "/users",
    adminMiddleware,
    async (req, res) => {

        try {

            const users =
                await User.find()
                    .select(
                        "name email role emailVerified isBlocked walletBalance createdAt"
                    )
                    .sort({
                        createdAt: -1
                    });

            return res.json({

                success: true,

                count:
                    users.length,

                users

            });

        } catch (error) {

            console.error(
                "Get users error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch users"

            });

        }

    }
);


// =====================================
// GET SINGLE USER
// =====================================

router.get(
    "/users/:id",
    adminMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                ).select(
                    "-password -otpHash"
                );

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }

            return res.json({

                success: true,

                user

            });

        } catch (error) {

            console.error(
                "Get user error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch user"

            });

        }

    }
);


// =====================================
// BLOCK USER
// =====================================

router.patch(
    "/users/:id/block",
    adminMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                );

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }

            if (
                user.role === "admin"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Admin account cannot be blocked"

                });

            }

            user.isBlocked = true;

            await user.save();

            return res.json({

                success: true,

                message:
                    "User blocked successfully",

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    isBlocked:
                        user.isBlocked

                }

            });

        } catch (error) {

            console.error(
                "Block user error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to block user"

            });

        }

    }
);


// =====================================
// UNBLOCK USER
// =====================================

router.patch(
    "/users/:id/unblock",
    adminMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.params.id
                );

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }

            user.isBlocked = false;

            await user.save();

            return res.json({

                success: true,

                message:
                    "User unblocked successfully",

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    isBlocked:
                        user.isBlocked

                }

            });

        } catch (error) {

            console.error(
                "Unblock user error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to unblock user"

            });

        }

    }
);


// =====================================
// GET ALL SERVICES
// =====================================

router.get(
    "/services",
    adminMiddleware,
    async (req, res) => {

        try {

            const services =
                await Service.find()
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
                "Get services error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch services"

            });

        }

    }
);


// =====================================
// GET SINGLE SERVICE
// =====================================

router.get(
    "/services/:id",
    adminMiddleware,
    async (req, res) => {

        try {

            const service =
                await Service.findById(
                    req.params.id
                );

            if (!service) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service not found"

                });

            }

            return res.json({

                success: true,

                service

            });

        } catch (error) {

            console.error(
                "Get service error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch service"

            });

        }

    }
);


// =====================================
// CREATE SERVICE
// =====================================

router.post(
    "/services",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                name,
                category,
                price,
                isAvailable
            } = req.body;

            if (
                !name ||
                !category ||
                price === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, category and price are required"

                });

            }

            if (
                isNaN(price) ||
                Number(price) < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a valid price"

                });

            }

            const existingService =
                await Service.findOne({

                    name:
                        name.trim()

                });

            if (existingService) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Service already exists"

                });

            }

            const service =
                await Service.create({

                    name:
                        name.trim(),

                    category:
                        category.trim(),

                    price:
                        Number(price),

                    isAvailable:
                        typeof isAvailable === "boolean"
                            ? isAvailable
                            : true

                });

            return res.status(201).json({

                success: true,

                message:
                    "Service created successfully",

                service

            });

        } catch (error) {

            console.error(
                "Create service error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to create service"

            });

        }

    }
);


// =====================================
// UPDATE SERVICE PRICE
// =====================================

router.patch(
    "/services/:id/price",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                price
            } = req.body;

            if (
                price === undefined ||
                price === null ||
                isNaN(price) ||
                Number(price) < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a valid price"

                });

            }

            const service =
                await Service.findById(
                    req.params.id
                );

            if (!service) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service not found"

                });

            }

            service.price =
                Number(price);

            await service.save();

            return res.json({

                success: true,

                message:
                    "Service price updated successfully",

                service

            });

        } catch (error) {

            console.error(
                "Update service price error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update service price"

            });

        }

    }
);


// =====================================
// ENABLE / DISABLE SERVICE
// =====================================

router.patch(
    "/services/:id/status",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                isAvailable
            } = req.body;

            if (
                typeof isAvailable !==
                "boolean"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "isAvailable must be true or false"

                });

            }

            const service =
                await Service.findById(
                    req.params.id
                );

            if (!service) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service not found"

                });

            }

            service.isAvailable =
                isAvailable;

            await service.save();

            return res.json({

                success: true,

                message:
                    isAvailable
                        ? "Service enabled successfully"
                        : "Service disabled successfully",

                service

            });

        } catch (error) {

            console.error(
                "Update service status error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update service status"

            });

        }

    }
);


// =====================================
// UPDATE COMPLETE SERVICE
// =====================================

router.put(
    "/services/:id",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                name,
                category,
                price,
                isAvailable
            } = req.body;

            const service =
                await Service.findById(
                    req.params.id
                );

            if (!service) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service not found"

                });

            }

            if (name !== undefined) {

                service.name =
                    name.trim();

            }

            if (category !== undefined) {

                service.category =
                    category.trim();

            }

            if (price !== undefined) {

                if (
                    isNaN(price) ||
                    Number(price) < 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Please provide a valid price"

                    });

                }

                service.price =
                    Number(price);

            }

            if (
                isAvailable !== undefined
            ) {

                if (
                    typeof isAvailable !==
                    "boolean"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "isAvailable must be true or false"

                    });

                }

                service.isAvailable =
                    isAvailable;

            }

            await service.save();

            return res.json({

                success: true,

                message:
                    "Service updated successfully",

                service

            });

        } catch (error) {

            console.error(
                "Update service error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update service"

            });

        }

    }
);


// =====================================
// DELETE SERVICE
// =====================================

router.delete(
    "/services/:id",
    adminMiddleware,
    async (req, res) => {

        try {

            const service =
                await Service.findById(
                    req.params.id
                );

            if (!service) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service not found"

                });

            }

            await Service.findByIdAndDelete(
                req.params.id
            );

            return res.json({

                success: true,

                message:
                    "Service deleted successfully"

            });

        } catch (error) {

            console.error(
                "Delete service error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete service"

            });

        }

    }
);


// =====================================
// GET SERVICE USAGE
// =====================================

router.get(
    "/service-usage",
    adminMiddleware,
    async (req, res) => {

        try {

            const usage =
                await ServiceUsage.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .populate(
                        "service",
                        "name category"
                    )
                    .sort({
                        createdAt: -1
                    });

            return res.json({

                success: true,

                count:
                    usage.length,

                usage

            });

        } catch (error) {

            console.error(
                "Service usage error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch service usage"

            });

        }

    }
);


// =====================================
// UPDATE SERVICE USAGE
// ADMIN CAN UPDATE STATUS + COMMENT
// =====================================

router.patch(
    "/service-usage/:id",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                status,
                comment
            } = req.body;


            // Validate status
            if (
                status !== undefined &&
                !["success", "failed"]
                    .includes(status)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Status must be success or failed"

                });

            }


            const usage =
                await ServiceUsage.findById(
                    req.params.id
                );


            if (!usage) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Service usage record not found"

                });

            }


            if (status !== undefined) {

                usage.status =
                    status;

            }


            if (comment !== undefined) {

                usage.comment =
                    String(comment)
                        .trim();

            }


            await usage.save();


            const updatedUsage =
                await ServiceUsage.findById(
                    usage._id
                )
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "service",
                    "name category"
                );


            return res.json({

                success: true,

                message:
                    "Service usage updated successfully",

                usage:
                    updatedUsage

            });

        } catch (error) {

            console.error(
                "Update service usage error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update service usage"

            });

        }

    }
);


// =====================================
// GET ALL REQUEST SERVICES (ADMIN)
// =====================================

router.get(
    "/request-services",
    adminMiddleware,
    async (req, res) => {

        try {

            const requestServices =
                await RequestService.find({})
                .sort({
                    category: 1,
                    name: 1
                });

            return res.json({

                success: true,

                count:
                    requestServices.length,

                requestServices

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

    }
);


// =====================================
// UPDATE REQUEST SERVICE PRICE
// =====================================

router.patch(
    "/request-services/:id/price",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                price
            } = req.body;

            if (
                price === undefined ||
                price === null ||
                isNaN(price) ||
                Number(price) < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a valid price"

                });

            }

            const requestService =
                await RequestService.findById(
                    req.params.id
                );

            if (!requestService) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Request service not found"

                });

            }

            requestService.price =
                Number(price);

            await requestService.save();

            return res.json({

                success: true,

                message:
                    "Request service price updated successfully",

                requestService

            });

        } catch (error) {

            console.error(
                "Update request service price error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update request service price"

            });

        }

    }
);


// =====================================
// ENABLE / DISABLE REQUEST SERVICE
// =====================================

router.patch(
    "/request-services/:id/status",
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                isAvailable
            } = req.body;

            if (
                typeof isAvailable !==
                "boolean"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "isAvailable must be true or false"

                });

            }

            const requestService =
                await RequestService.findById(
                    req.params.id
                );

            if (!requestService) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Request service not found"

                });

            }

            requestService.isAvailable =
                isAvailable;

            await requestService.save();

            return res.json({

                success: true,

                message:
                    isAvailable
                        ? "Request service enabled successfully"
                        : "Request service disabled successfully",

                requestService

            });

        } catch (error) {

            console.error(
                "Update request service status error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to update request service status"

            });

        }

    }
);


// =====================================
// DEFAULT EXPORT
// =====================================

export default router;