


// import mongoose from "mongoose";

// const serviceRequestSchema = new mongoose.Schema(
//     {
//         // =====================================
//         // USER
//         // =====================================

//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         // =====================================
//         // SERVICE
//         // =====================================

//         service: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Service",
//             required: true
//         },

//         serviceName: {
//             type: String,
//             required: true
//         },

//         category: {
//             type: String,
//             required: true
//         },

//         // =====================================
//         // USER SUBMITTED DATA
//         // =====================================

//         requestData: {
//             type: mongoose.Schema.Types.Mixed,
//             required: true
//         },

//         // =====================================
//         // AMOUNT
//         // =====================================

//         amount: {
//             type: Number,
//             required: true,
//             min: 0
//         },

//         // =====================================
//         // STATUS
//         // =====================================

//         status: {
//             type: String,
//             enum: [
//                 "Pending",
//                 "Processing",
//                 "Success",
//                 "Failed"
//             ],
//             default: "Pending"
//         },

//         // =====================================
//         // ADMIN RESPONSE
//         // =====================================

//         adminRemark: {
//             type: String,
//             default: ""
//         },

//         result: {
//             type: String,
//             default: ""
//         }
//     },

//     {
//         timestamps: true
//     }
// );

// const ServiceRequest = mongoose.model(
//     "ServiceRequest",
//     serviceRequestSchema
// );

// export default ServiceRequest;



import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
    {
        // ================================
        // USER
        // ================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ================================
        // REQUEST SERVICE
        // ================================

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RequestService",
            required: true
        },

        serviceName: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        // ================================
        // USER SUBMITTED DATA
        // ================================

        requestData: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        // ================================
        // AMOUNT
        // ================================

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        // ================================
        // STATUS
        // ================================

        status: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Success",
                "Failed"
            ],
            default: "Pending"
        },

        // ================================
        // ADMIN
        // ================================

        adminRemark: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000
        },

        result: {
            type: String,
            default: "",
            trim: true,
            maxlength: 5000
        }
    },
    {
        timestamps: true
    }
);


// Useful indexes

serviceRequestSchema.index({
    user: 1,
    createdAt: -1
});

serviceRequestSchema.index({
    status: 1,
    createdAt: -1
});


const ServiceRequest = mongoose.model(
    "ServiceRequest",
    serviceRequestSchema
);

export default ServiceRequest;