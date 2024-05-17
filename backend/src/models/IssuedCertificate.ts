import mongoose from "mongoose"

export interface IssuedCertificateDocument extends Document {
    issuer: mongoose.Schema.Types.ObjectId
    certificate: string
    issued_to: string
    issued_address: string
    transaction_hash: string
}

const issuedCertificateSchema = new mongoose.Schema<IssuedCertificateDocument>(
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
        issued_to: {
            type: String,
            required: true,
        },
        issued_address: {
            type: String,
            required: true,
        },
        transaction_hash: {
            type: String,
            required: false,
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
