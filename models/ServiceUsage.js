



// import mongoose from "mongoose";

// const serviceUsageSchema = new mongoose.Schema(
//     {
//         // User who used the service
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         // Service that was used
//         service: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Service",
//             required: true
//         },

//         // Store name so old history remains correct
//         serviceName: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         // Charge at the time service was used
//         charge: {
//             type: Number,
//             required: true,
//             min: 0
//         },

//         // Service usage status
//         status: {
//             type: String,
//             enum: ["success", "failed"],
//             default: "success"
//         }
//     },

//     {
//         timestamps: true
//     }
// );


// // Fast user-wise history
// serviceUsageSchema.index({
//     user: 1,
//     createdAt: -1
// });


// // Fast service-wise history
// serviceUsageSchema.index({
//     service: 1,
//     createdAt: -1
// });


// const ServiceUsage = mongoose.model(
//     "ServiceUsage",
//     serviceUsageSchema
// );

// export default ServiceUsage;



import mongoose from "mongoose";

const serviceUsageSchema = new mongoose.Schema(
    {
        // =====================================
        // USER
        // =====================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // =====================================
        // SERVICE
        // =====================================

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },


        // =====================================
        // SERVICE NAME
        // =====================================

        serviceName: {
            type: String,
            required: true,
            trim: true
        },


        // =====================================
        // CHARGE
        // =====================================

        charge: {
            type: Number,
            required: true,
            min: 0
        },


        // =====================================
        // STATUS
        // =====================================

        status: {
            type: String,
            enum: ["success", "failed"],
            default: "success"
        },


        // =====================================
        // ADMIN COMMENT
        // =====================================

        comment: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500
        }
    },

    {
        timestamps: true
    }
);


// =====================================
// INDEXES
// =====================================

serviceUsageSchema.index({
    user: 1,
    createdAt: -1
});

serviceUsageSchema.index({
    service: 1,
    createdAt: -1
});


const ServiceUsage = mongoose.model(
    "ServiceUsage",
    serviceUsageSchema
);

export default ServiceUsage;