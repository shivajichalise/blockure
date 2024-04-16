import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        // Used any as type because it was throwing:
        // Catch clause variable type annotation must be 'any' or 'unknown' if specified.
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
