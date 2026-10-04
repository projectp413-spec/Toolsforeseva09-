

import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "./models/Service.js";

dotenv.config();

const services = [

    // =====================================
    // AADHAAR SERVICES
    // =====================================

    {
        name: "Aadhaar to PAN",
        category: "Aadhaar",
        price: 7,
        isAvailable: true
    },

    {
        name: "UID to Name",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },

    {
        name: "Aadhaar to PAN Link Check",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },

    {
        name: "Aadhaar Data Check",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },

    {
        name: "Aadhaar Details",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },

    {
        name: "Enrolment Status",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },

    {
        name: "Aadhaar Verify",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },

    {
        name: "NPCI Status Check",
        category: "Aadhaar",
        price: 5,
        isAvailable: true
    },


    // =====================================
    // PAN SERVICES
    // =====================================

    {
        name: "PAN to Mask Aadhaar",
        category: "PAN",
        price: 5,
        isAvailable: true
    },

    {
        name: "PAN to Aadhaar",
        category: "PAN",
        price: 7,
        isAvailable: true
    },

    {
        name: "PAN to Name",
        category: "PAN",
        price: 5,
        isAvailable: true
    },

    {
        name: "PAN to Name and DOB",
        category: "PAN",
        price: 5,
        isAvailable: true
    },

    {
        name: "PAN Details Prime",
        category: "PAN",
        price: 5,
        isAvailable: true
    },

    {
        name: "PAN Number by GST Number",
        category: "PAN",
        price: 5,
        isAvailable: true
    },

    {
        name: "Mobile to PAN",
        category: "PAN",
        price: 5,
        isAvailable: true
    },


    // =====================================
    // VOTER SERVICES
    // =====================================

    {
        name: "Voter Verification",
        category: "Voter",
        price: 5,
        isAvailable: true
    },

    {
        name: "Voter Mobile No Change",
        category: "Voter",
        price: 5,
        isAvailable: true
    },

    {
        name: "Voter Download Send OTP",
        category: "Voter",
        price: 5,
        isAvailable: true
    },

    {
        name: "Voter Download Verify",
        category: "Voter",
        price: 5,
        isAvailable: true
    },

    {
        name: "Voter Mobile Link Without E-Sign",
        category: "Voter",
        price: 5,
        isAvailable: true
    },


    // =====================================
    // RATION SERVICES
    // =====================================

    {
        name: "Ration to UID All State",
        category: "Ration",
        price: 5,
        isAvailable: true
    },

    {
        name: "Ration PDF",
        category: "Ration",
        price: 5,
        isAvailable: true
    },

    {
        name: "Aadhaar to Ration PDF",
        category: "Ration",
        price: 5,
        isAvailable: true
    },

    {
        name: "Ration to Basic Details",
        category: "Ration",
        price: 5,
        isAvailable: true
    },

    {
        name: "UP Ration to UID",
        category: "Ration",
        price: 5,
        isAvailable: true
    },

    {
        name: "Ration to Aadhaar All State 2",
        category: "Ration",
        price: 5,
        isAvailable: true
    },


    // =====================================
    // VEHICLE SERVICES
    // =====================================

    {
        name: "RC to Mobile",
        category: "Vehicle",
        price: 5,
        isAvailable: true
    },

    {
        name: "Mobile to RC",
        category: "Vehicle",
        price: 5,
        isAvailable: true
    },

    {
        name: "Vehicle RC Verification",
        category: "Vehicle",
        price: 5,
        isAvailable: true
    },

    {
        name: "E-Challan Verification",
        category: "Vehicle",
        price: 5,
        isAvailable: true
    },

    {
        name: "Learning Licence Download",
        category: "Vehicle",
        price: 15,
        isAvailable: true
    },

    {
        name: "DL Verification Plus",
        category: "Vehicle",
        price: 10,
        isAvailable: true
    },

    {
        name: "DL Verification Advance",
        category: "Vehicle",
        price: 5,
        isAvailable: true
    },


    // =====================================
    // FARMER SERVICES
    // =====================================

    {
        name: "Agristack Status",
        category: "Farmer",
        price: 5,
        isAvailable: true
    },

    {
        name: "Land Seeding / PM Kisan",
        category: "Farmer",
        price: 5,
        isAvailable: true
    },


    // =====================================
    // OTHER SERVICES
    // =====================================

    {
        name: "eShram Card Download",
        category: "Other",
        price: 5,
        isAvailable: true
    },

    {
        name: "UID to eShram Details",
        category: "Other",
        price: 5,
        isAvailable: true
    },

    {
        name: "PIN Code Verification",
        category: "Other",
        price: 5,
        isAvailable: true
    },

    {
        name: "Ayushmaan Card Download",
        category: "Other",
        price: 10,
        isAvailable: true
    }

];


// =====================================
// SEED SERVICES
// =====================================

async function seedServices() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected successfully ✅"
        );


        let created = 0;
        let skipped = 0;


        for (const serviceData of services) {

            const existingService =
                await Service.findOne({
                    name: serviceData.name
                });


            if (existingService) {

                skipped++;

                console.log(
                    `Skipped: ${serviceData.name}`
                );

                continue;
            }


            await Service.create(
                serviceData
            );

            created++;

            console.log(
                `Created: ${serviceData.name}`
            );

        }


        console.log("");
        console.log(
            "====================================="
        );
        console.log(
            "SERVICE SEED COMPLETED"
        );
        console.log(
            "====================================="
        );

        console.log(
            `Created: ${created}`
        );

        console.log(
            `Skipped: ${skipped}`
        );

        console.log(
            `Total: ${services.length}`
        );


        await mongoose.disconnect();

        process.exit(0);


    } catch (error) {

        console.error(
            "Service seed failed ❌"
        );

        console.error(
            error
        );

        await mongoose.disconnect();

        process.exit(1);

    }

}


seedServices();