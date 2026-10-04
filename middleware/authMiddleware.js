


// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//     try {

//         const authHeader = req.headers.authorization;

//         // Token check
//         if (
//             !authHeader ||
//             !authHeader.startsWith("Bearer ")
//         ) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Authentication token required"
//             });
//         }

//         // Get token
//         const token = authHeader.split(" ")[1];

//         // Verify token
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET
//         );

//         // Set logged-in user
//         req.user = {
//             id: decoded.userId,
//             role: decoded.role
//         };

//         next();

//     } catch (error) {

//         console.error(
//             "Authentication error:",
//             error.message
//         );

//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token"
//         });
//     }
// };

// export default authMiddleware;






import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
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

        req.user = {
            id: decoded.userId,
            role: decoded.role
        };

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
};

export default authMiddleware;