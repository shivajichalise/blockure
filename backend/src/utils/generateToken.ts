import jwt from "jsonwebtoken"

export default function generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "1h" })
}
