


import ServiceUsage from "../models/ServiceUsage.js";


// =====================================
// CREATE SERVICE USAGE
// =====================================

export async function createServiceUsage({
    userId,
    service,
    price,
    status = "pending",
    requestData = null,
    responseData = null,
    errorMessage = null
}) {

    try {

        const usage =
            await ServiceUsage.create({

                user: userId,

                service: service._id,

                serviceName: service.name,

                category: service.category,

                price: price ?? service.price,

                status,

                requestData,

                responseData,

                errorMessage

            });

        return usage;

    } catch (error) {

        console.error(
            "Create service usage error:",
            error
        );

        return null;
    }
}


// =====================================
// UPDATE SERVICE USAGE
// =====================================

export async function updateServiceUsage(
    usageId,
    data
) {

    try {

        const usage =
            await ServiceUsage.findByIdAndUpdate(
                usageId,
                {
                    $set: data
                },
                {
                    new: true
                }
            );

        return usage;

    } catch (error) {

        console.error(
            "Update service usage error:",
            error
        );

        return null;
    }
}