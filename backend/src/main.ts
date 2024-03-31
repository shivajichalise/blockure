import express from "express"
import cors from "cors"
import "dotenv/config"

const app = express()
app.use(express.json())

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
)

app.get("/api", (_, res) => {
    return res.status(200).json({ message: "Hello, World!" })
})

export default app
