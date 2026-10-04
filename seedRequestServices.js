






import mongoose from "mongoose";
import dotenv from "dotenv";
import RequestService from "./models/RequestService.js";

dotenv.config();

const requestServices = [

    // ================================
    // PAN SERVICE
    // ================================

    {
        name: "NEW PAN WITHOUT DOB PROOF",
        category: "PAN SERVICE",
        description: "Request for new PAN without DOB proof.",
        price: 0,

        fields: [
            {
                name: "name",
                label: "Applicant Name",
                type: "text",
                placeholder: "Full name",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "address",
                label: "Address",
                type: "text",
                placeholder: "Full address",
                required: true
            },
            {
                name: "remarks",
                label: "Additional Details",
                type: "text",
                placeholder: "Any additional information",
                required: false
            }
        ]
    },

    {
        name: "PAN CORRECTION",
        category: "PAN SERVICE",
        description: "Request for PAN correction.",
        price: 0,

        fields: [
            {
                name: "pan",
                label: "PAN Number",
                type: "text",
                placeholder: "ABCDE1234F",
                required: true
            },
            {
                name: "name",
                label: "Correct Name",
                type: "text",
                placeholder: "Full name",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "correction",
                label: "Correction Required",
                type: "text",
                placeholder: "Describe correction",
                required: true
            }
        ]
    },

    {
        name: "ZERO CIBIL PAN",
        category: "PAN SERVICE",
        description: "Request for Zero CIBIL PAN service.",
        price: 0,

        fields: [
            {
                name: "name",
                label: "Applicant Name",
                type: "text",
                placeholder: "Full name",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "remarks",
                label: "Additional Details",
                type: "text",
                placeholder: "Additional information",
                required: false
            }
        ]
    },

    // ================================
    // AADHAAR SERVICE
    // ================================

    {
        name: "EID TO AADHAAR NO",
        category: "AADHAAR SERVICE",
        description: "Request using Aadhaar enrolment ID.",
        price: 0,

        fields: [
            {
                name: "eid",
                label: "EID",
                type: "text",
                placeholder: "Enter EID",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            }
        ]
    },

    {
        name: "AADHAAR NO TO DETAILS",
        category: "AADHAAR SERVICE",
        description: "Request for Aadhaar details.",
        price: 0,

        fields: [
            {
                name: "aadhaar",
                label: "Aadhaar Number",
                type: "text",
                placeholder: "12 digit Aadhaar",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            }
        ]
    },

    {
        name: "CANCELLED AADHAAR",
        category: "AADHAAR SERVICE",
        description: "Request for cancelled Aadhaar service.",
        price: 0,

        fields: [
            {
                name: "aadhaar",
                label: "Aadhaar Number",
                type: "text",
                placeholder: "12 digit Aadhaar",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "reason",
                label: "Reason",
                type: "text",
                placeholder: "Reason for request",
                required: true
            }
        ]
    },

    // ================================
    // LAND SEEDING
    // ================================

    {
        name: "LAND SEEDING (PM KISAN)",
        category: "LAND SEEDING",
        description: "Request for PM Kisan land seeding.",
        price: 0,

        fields: [
            {
                name: "aadhaar",
                label: "Aadhaar Number",
                type: "text",
                placeholder: "12 digit Aadhaar",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "state",
                label: "State",
                type: "text",
                placeholder: "State",
                required: true
            },
            {
                name: "district",
                label: "District",
                type: "text",
                placeholder: "District",
                required: true
            },
            {
                name: "landDetails",
                label: "Land Details",
                type: "text",
                placeholder: "Khata / land details",
                required: true
            }
        ]
    },

    // ================================
    // DL MOBILE LINK
    // ================================

    {
        name: "DL MOBILE LINK",
        category: "DL MOBILE LINK",
        description: "Request to link mobile number with driving licence.",
        price: 0,

        fields: [
            {
                name: "dlNumber",
                label: "Driving Licence Number",
                type: "text",
                placeholder: "DL number",
                required: true
            },
            {
                name: "dob",
                label: "Date of Birth",
                type: "date",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            }
        ]
    },

    // ================================
    // VOTER SERVICE
    // ================================

    {
        name: "VOTER SERVICE",
        category: "VOTER SERVICE",
        description: "Request for voter related service.",
        price: 0,

        fields: [
            {
                name: "epic",
                label: "EPIC / Voter Number",
                type: "text",
                placeholder: "EPIC number",
                required: true
            },
            {
                name: "name",
                label: "Applicant Name",
                type: "text",
                placeholder: "Full name",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "request",
                label: "Service Required",
                type: "text",
                placeholder: "Describe required service",
                required: true
            }
        ]
    },

    // ================================
    // PUC
    // ================================

    {
        name: "PUC",
        category: "PUC",
        description: "Request for PUC related service.",
        price: 0,

        fields: [
            {
                name: "rcNumber",
                label: "Vehicle RC Number",
                type: "text",
                placeholder: "Vehicle RC number",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            }
        ]
    },

    // ================================
    // RATION CARD
    // ================================

    {
        name: "RATION CARD SERVICE",
        category: "RATION CARD SERVICE",
        description: "Request for ration card related service.",
        price: 0,

        fields: [
            {
                name: "rationNumber",
                label: "Ration Card Number",
                type: "text",
                placeholder: "Ration card number",
                required: true
            },
            {
                name: "name",
                label: "Applicant Name",
                type: "text",
                placeholder: "Full name",
                required: true
            },
            {
                name: "mobile",
                label: "Mobile Number",
                type: "tel",
                placeholder: "10 digit mobile number",
                required: true
            },
            {
                name: "request",
                label: "Service Required",
                type: "text",
                placeholder: "Describe required service",
                required: true
            }
        ]
    }
];


// ================================================
// SEED FUNCTION
// ================================================

async function seedRequestServices() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected successfully"
        );


        // Purane request services delete
        await RequestService.deleteMany({});


        // Naye services insert
        await RequestService.insertMany(
            requestServices
        );


        console.log(
            `${requestServices.length} request services inserted successfully`
        );


        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Seed error:",
            error
        );

        process.exit(1);

    }

}


seedRequestServices();