import mongoose from "mongoose"

const issuedCertificateSchema = new mongoose.Schema(
    {
        issuer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        certificate: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Certificate",
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
