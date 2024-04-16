import mongoose from "mongoose"

const certificateSchema = new mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: "User",
        // },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: [
                "Degree",
                "Course Completion",
                "Participation",
                "Appreciation",
            ],
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Certificate = mongoose.model("Certificate", certificateSchema)

export default Certificate
