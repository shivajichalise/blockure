import { Request, Response } from "express"
import Certificate from "../models/Certificate"
import { validationResult } from "express-validator"
import path from "path"
import Jimp from "jimp"

interface Color {
    red: number
    green: number
    blue: number
}

interface Field {
    value: string
    x: number
    y: number
    angle: number
    color: Color
}

interface Fields {
    [fieldName: string]: Field
}

export function test(_: Request, res: Response) {
    return res.status(200).json({ message: "Certificates!" })
}

export async function create(req: Request, res: Response) {
    const certificateImage = req.file
    const { title, description, type } = req.body

    if (!certificateImage) {
        return res
            .status(400)
            .json({ message: "Please provide valid certificate image." })
    }

    const image = certificateImage.path.split("/")[1]

    const certificate = await Certificate.create({
        title,
        description,
        type,
        image,
    })

    if (certificate) {
        return res.status(201).json({
            _id: certificate._id,
            title: certificate.title,
            description: certificate.description,
            type: certificate.type,
            image: certificate.image,
        })
    } else {
        res.status(400)
        throw new Error("Invalid certificate data!")
    }
}

// below function works when certificate image is accepted from the request.. works from postman
// export async function issue(req: Request, res: Response) {
//     const result = validationResult(req)
//
//     if (!result.isEmpty()) {
//         return res.send({ errors: result.array() })
//     }
//
//     const certificateImage = req.file
//
//     if (!certificateImage) {
//         return res
//             .status(400)
//             .json({ message: "Please provide valid certificate image." })
//     }
//
//     const image = certificateImage.path.split("/")[1]
//
//     const { fields } = req.body
//
//     return await generate(image, fields, res)
// }

export async function issue(req: Request, res: Response) {
    const image = req.body.certificate

    const { fields } = req.body

    return await generate(image, fields, res)
}

async function generate(image: string, fields: Fields, res: Response) {
    const imagePath = path.join("uploads/", image)
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
    const img = await Jimp.read(imagePath)

    for (const field in fields) {
        const { value, x, y, angle, color } = fields[field]

        const xInt = typeof x === "string" ? parseInt(x, 10) : x
        const yInt = typeof y === "string" ? parseInt(y, 10) : y
        const angleInt = typeof angle === "string" ? parseInt(angle, 10) : angle

        let textImage = await Jimp.create(300, 300, 0x0)

        textImage.print(font, 0, 0, value)
        textImage.color([
            // @ts-ignore
            { apply: "xor", params: [color] },
        ])

        if (angleInt !== 0) {
            textImage.rotate(angleInt)
            img.blit(textImage, 0, 0)
        } else {
            img.blit(textImage, xInt, yInt)
        }
    }

    await img
        .writeAsync(`certificates/certificate-${image}`)
        .then((success) => {
            return res.status(201).json({ message: "Certificate generated!" })
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ message: "Certificate generation failed!", error: err })
        })
}

export async function upload(req: Request, res: Response) {
    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.send({ errors: result.array() })
    }

    const certificateImage = req.file

    if (!certificateImage) {
        return res
            .status(400)
            .json({ message: "Please provide valid certificate image." })
    }

    const image = certificateImage.path.split("/")[1]

    return res
        .status(201)
        .json({ message: "Certificate uploaded!", certificate: image })
}
