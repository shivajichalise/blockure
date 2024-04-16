import { Request, Response } from "express"

export function test(_: Request, res: Response) {
    return res.status(200).json({ message: "Certificates!" })
}

export function create(req: Request, res: Response) {
    const certificate = req.file
    const { fields } = req.body

    res.send(`/${req.file!.path.split("/")[1]}/${req.file!.path.split("/")[2]}`)
    return res.status(200).json({ message: "Certificates!" })
}
