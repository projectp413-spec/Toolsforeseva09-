


import mongoose from "mongoose";

const requestServiceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        fields: [
            {
                name: {
                    type: String,
                    required: true
                },

                label: {
                    type: String,
                    required: true
                },

                type: {
                    type: String,
                    default: "text"
                },

                placeholder: {
                    type: String,
                    default: ""
                },

                required: {
                    type: Boolean,
                    default: true
                }
            }
        ],

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


// IMPORTANT:
// Prevent OverwriteModelError

const RequestService =
    mongoose.models.RequestService ||
    mongoose.model(
        "RequestService",
        requestServiceSchema
    );


export default RequestService;