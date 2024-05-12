import { Request } from "express"
import jwt from "jsonwebtoken"

function getCurrentUserId(req: Request) {
    const authHeader = req.headers["authorization"]
    const token = authHeader ? authHeader.split(" ")[1] : ""
    const decodedToken = jwt.decode(token) as { id?: string } // Type assertion
    const user_id = decodedToken?.id || null // Optional chaining
    return user_id
}

export default getCurrentUserId
