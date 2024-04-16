import express from "express"
import { test, create } from "../controllers/certificateController"
import handleUpload from "../utils/multer"

const router = express.Router()

router.get("/", test)

router.post("/", handleUpload.single("image"), create)

export default router
