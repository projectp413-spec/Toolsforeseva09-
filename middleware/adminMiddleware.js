


import jwt from "jsonwebtoken";
import User from "../models/User.js";


// =====================================
// ADMIN AUTH MIDDLEWARE
// =====================================

const adminMiddleware = async (req, res, next) => {

    try {

        // =====================================
        // GET TOKEN
        // =====================================

        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required"

            });

        }


        const token =
            authHeader.split(" ")[1];


        // =====================================
        // VERIFY JWT
        // =====================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // =====================================
        // FIND USER
        // =====================================

        const user =
            await User.findById(
                decoded.userId
            );


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // =====================================
        // CHECK ADMIN ROLE
        // =====================================

        if (
            user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required"

            });

        }


        // =====================================
        // ATTACH USER
        // =====================================

        req.user = {

            id:
                user._id,

            name:
                user.name,

            email:
                user.email,

            role:
                user.role

        };


        next();


    } catch (error) {

        console.error(
            "Admin middleware error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"

        });

    }

};


export default adminMiddleware;