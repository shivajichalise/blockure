import { Request, Response } from "express"
import User, { UserDocument } from "../models/User"
import generateToken from "../utils/generateToken"
import { success } from "../utils/httpResponses"
import HttpResponsesParams from "../types/HttpResponsesParams"

// @desc    Register a user
// @route   Post /api/auth/register
// @access  Public

export async function register(req: Request, res: Response) {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(400).json({ message: "User already exists." })
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
        return res.status(400).json({ messgae: "Invalid user data." })
    }
}

// @desc    Login a user
// @route   Post /api/auth/login
// @access  Public

export async function login(req: Request, res: Response) {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id.toString())
        const successParams: HttpResponsesParams<{
            user: UserDocument
            token: string
        }> = {
            res: res,
            data: { user: user, token: token },
            message: "Account created successfully.",
            code: 200,
        }
        return success(successParams)
    } else {
        return res.status(401).json({
            message: "Invalid email or password.",
        })
    }
}
