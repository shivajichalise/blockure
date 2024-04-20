import express from "express"
import { login, register } from "../controllers/authController"
import { body } from "express-validator"

const router = express.Router()

router.post(
    "/register",
    [
        body("name").trim().notEmpty().withMessage("Name field is required."),
        body("email").trim().isEmail().withMessage("Email is not valid."),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password has to be min 8 characters."),
        body("password_confirmation")
            .custom((value, { req }) => {
                return value === req.body.password
            })
            .withMessage("Passwords do not match."),
    ],
    register
)

router.post(
    "/login",
    [
        body("email").trim().isEmail().withMessage("Email is not valid."),
        body("password").notEmpty().withMessage("Password field is required."),
    ],
    login
)

export default router
