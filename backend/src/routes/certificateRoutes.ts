import express from "express"
import {
    test,
    create,
    issue,
    upload,
} from "../controllers/certificateController"
import handleUpload from "../utils/multer"
import { body } from "express-validator"

const router = express.Router()

router.get("/", test)

router.post("/", handleUpload.single("image"), create)

router.post("/upload", handleUpload.single("certificate"), upload)

router.post(
    "/issue",
    handleUpload.single("certificate"),
    [
        body("fields").custom((value) => {
            if (Object.keys(value).length === 0) {
                throw new Error("At least one field is required!")
            }
            return true
        }),
    ],
    [
        body("fields.*").custom((value) => {
            const requiredProperties = ["value", "x", "y", "angle", "color"]
            const missingProperties = requiredProperties.filter(
                (prop) => !(prop in value)
            )
            if (missingProperties.length > 0) {
                throw new Error(
                    `Missing properties: ${missingProperties.join(", ")}`
                )
            }
            return true
        }),
    ],
    [
        body("fields.*.value")
            .trim()
            .notEmpty()
            .withMessage("Value for every field is required!"),
    ],
    [
        body("fields.*.x")
            .trim()
            .notEmpty()
            .withMessage("X field is required!")
            .isNumeric()
            .withMessage("Value for X should be numeric!"),
    ],
    [
        body("fields.*.y")
            .trim()
            .notEmpty()
            .withMessage("Y field is required!")
            .isNumeric()
            .withMessage("Value for Y should be numeric!"),
    ],
    [
        body("fields.*.angle")
            .trim()
            .notEmpty()
            .withMessage("Angle field is required!")
            .isNumeric()
            .withMessage("Angle should be numeric!")
            .custom((value) => {
                const angle = parseFloat(value)
                if (angle < 0 || angle > 360) {
                    throw new Error("Angle should be between 0 and 360!")
                }
                return true
            }),
    ],
    [
        body("fields.*.color")
            .trim()
            .notEmpty()
            .withMessage("Color field is required!")
            .custom((value) => {
                let regex = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)

                if (regex.test(value) === true) {
                    return "true"
                } else {
                    throw new Error("Not a valid Hex color code!")
                }
            }),
    ],
    [
        body("certificate")
            .custom((_value, { req }) => {
                const file = req.file
                const fileTypes = /jpg|jpeg|png/
                const mimeType = fileTypes.test(file.mimetype)
                if (!mimeType) {
                    throw new Error("Not a valid image!")
                } else {
                    return true
                }
            })
            .withMessage("Certificate image is required!"),
    ],
    issue
)

export default router
