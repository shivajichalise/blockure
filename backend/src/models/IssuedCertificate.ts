import mongoose from "mongoose"

const issuedCertificateSchema = new mongoose.Schema(
    {
        issuer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        certificate: {
            type: String,
            required: true,
        },
        recipientDetails: {
            name: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
        },
        transactionHash: {
            type: String,
            required: false,
        },
        issuedDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const IssuedCertificate = mongoose.model(
    "Issued Certificate",
    issuedCertificateSchema
)

export default IssuedCertificate
