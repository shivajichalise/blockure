import { Request, Response } from "express"

export function test(_: Request, res: Response) {
    return res.status(200).json({ message: "Certificates!" })
}

export function create(req: Request, res: Response) {
    const certificate = req.file
    const { fields } = req.body
    const certificateFields = JSON.parse(fields)

    if (!certificate) {
        return res
            .status(400)
            .json({ message: "Please provide valid certificate image." })
    }

    const uploaded = certificate.path.split("/")[1]

    return res.status(200).json({ message: "Certificates!" })
}
