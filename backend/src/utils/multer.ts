import path from "path"
import multer, { FileFilterCallback } from "multer"

const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, "uploads/")
    },
    filename(_req, file, cb) {
        cb(
            null,
            `${file.originalname.split(".")[0]}-${Date.now()}${path.extname(
                file.originalname
            )}`
        )
    },
})

function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
    const fileTypes = /jpg|jpeg|png/
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimeType = fileTypes.test(file.mimetype)

    if (extname && mimeType) {
        return cb(null, true)
    } else {
        cb(Error("Images (JPG, JPEG or PNG) only!"))
    }
}

const handleUpload = multer({
    storage: storage,
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb)
    },
})

export default handleUpload
