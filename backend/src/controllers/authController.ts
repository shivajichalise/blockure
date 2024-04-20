import { Request, Response } from "express"
import User from "../models/User"
import generateToken from "../utils/generateToken"

// @desc    Register a user
// @route   Post /api/auth/register
// @access  Public

export async function register(req: Request, res: Response) {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({ name, email, password })

    if (user) {
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id.toString()),
        })
    } else {
        res.status(400).json({ messgae: "Invalid user data" })
        throw new Error("Invalid User data")
    }
}

// @desc    Login a user
// @route   Post /api/auth/login
// @access  Public

export async function login(req: Request, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id.toString()),
        })
    } else {
        res.status(401).json({
            message: "Invalid email or password",
        })
        throw new Error("Invalid email or password")
    }
}
