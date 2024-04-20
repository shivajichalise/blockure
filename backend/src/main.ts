import express from "express"
import cors from "cors"
import "dotenv/config"
import certificateRoutes from "./routes/certificateRoutes"
import authRoutes from "./routes/authRoutes"
import connectDB from "./config/db"

// connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
)

app.get("/api", (_, res) => {
    return res.status(200).json({ message: "Hello, World!" })
})

app.use("/api/certificates", certificateRoutes)
app.use("/api/auth", authRoutes)

export default app
