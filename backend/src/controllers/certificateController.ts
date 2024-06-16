import { Request, Response } from "express"
import Certificate from "../models/Certificate"
import { validationResult } from "express-validator"
import path from "path"
import Jimp from "jimp"
import IssuedCertificate from "../models/IssuedCertificate"
import getCurrentUserId from "../utils/getCurrentUserId"
import generateSlug from "../utils/generateSlug"
import pinataSDK, { PinataPinOptions } from "@pinata/sdk"
import fs from "fs"
import mint from "../scripts/mint"
import { UserDocument } from "../models/User"
import "dotenv/config"

const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
)

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

export async function all(_: Request, res: Response) {
    const issuedCertificates = await IssuedCertificate.find({}).populate<{
        issuer: UserDocument
    }>("issuer", "name")

    let sn = 1
    const formattedData = issuedCertificates.map((cert) => ({
        key: sn++,
        issuer: cert.issuer.name,
        certificate: cert.certificate,
        issued_to: cert.issued_to,
        issued_address: cert.issued_address,
        transaction_hash: cert.transaction_hash,
    }))

    return res.status(200).json({ certificates: formattedData })
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

async function storeOnDB(
    issuer: string,
    certificate: string,
    recipientName: string,
    recipientAddress: string,
    transactionHash: string
) {
    const issued = await IssuedCertificate.create({
        issuer: issuer,
        certificate: certificate,
        issued_to: recipientName,
        issued_address: recipientAddress,
        transaction_hash: transactionHash,
    })

    if (issued) {
        return true
    } else {
        return false
    }
}

async function pinOnIPFS(dir: string, name: string) {
    const stream = fs.createReadStream(dir)

    const dirSplit = dir.split("/")
    const directory = dirSplit[0] + "/" + dirSplit[1]
    const file = dirSplit[2]

    const options: PinataPinOptions = {
        pinataMetadata: {
            name: file,
            keyvalues: null,
        },
        pinataOptions: {
            cidVersion: 0,
        },
    }

    const res = await pinata.pinFileToIPFS(stream, options)

    const ipfsHash = res.IpfsHash

    const metadata = {
        name: name,
        description: `Certificate issued to ${name}`,
        image: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    }

    // const jsonString = JSON.stringify(metadata)

    // fs.writeFileSync(`${directory}/${file}-metadata.json`, jsonString)

    const metadataOptions: PinataPinOptions = {
        pinataMetadata: {
            name: `${file}-metadata.json`,
            description: `This json file is the meta data for the file ${file}`,
            keyvalues: null,
        },
        pinataOptions: {
            cidVersion: 0,
        },
    }

    try {
        const resMetadata = await pinata.pinJSONToIPFS(
            metadata,
            metadataOptions
        )

        return resMetadata.IpfsHash
    } catch (err) {
        console.error(err)
    }
}

export async function issue(req: Request, res: Response) {
    const image = req.body.certificate

    const { recipient, address, fields } = req.body

    const certificatesDirectoryPath = path.join("certificates")
    const issueDirectoryPath = path.join(
        `certificates/${generateSlug(recipient + "-" + address)}`
    )

    if (!fs.existsSync(certificatesDirectoryPath)) {
        fs.mkdirSync(certificatesDirectoryPath)
    }

    if (!fs.existsSync(issueDirectoryPath)) {
        fs.mkdirSync(issueDirectoryPath)
    }

    const generated = JSON.parse(
        await generate(image, fields, issueDirectoryPath)
    )

    if (generated.status) {
        // pin the dir with certificate to IPFS
        const metadataIpfsHash = await pinOnIPFS(generated.image, recipient)

        const transactionHash = await mint(
            address,
            `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
        )

        const userId = getCurrentUserId(req)!

        const store = await storeOnDB(
            userId,
            generated.image,
            recipient,
            address,
            transactionHash
        )

        if (store) {
            return res.status(201).json({
                message: "Certificate generated!",
            })
        } else {
            return res
                .status(400)
                .json({ messgae: "Certificate generation failed." })
        }
    } else {
        return res
            .status(500)
            .json({ messgae: "Certificate generation failed." })
    }
}

export async function issueTemplate(req: Request, res: Response) {
    const templatePath = path.join(
        __dirname,
        "..",
        "..",
        "src",
        "assets",
        "blockure_certificate_template.png"
    )

    const {
        certificate_type,
        recipient_name,
        recipient_address,
        certificate_text,
    } = req.body

    const certificatesDirectoryPath = path.join("certificates")
    const issueDirectoryPath = path.join(
        `certificates/${generateSlug(recipient_name + "-" + recipient_address)}`
    )

    if (!fs.existsSync(certificatesDirectoryPath)) {
        fs.mkdirSync(certificatesDirectoryPath)
    }

    if (!fs.existsSync(issueDirectoryPath)) {
        fs.mkdirSync(issueDirectoryPath)
    }

    const generated = JSON.parse(
        await generateFromTemplate(
            templatePath,
            certificate_type,
            recipient_name,
            recipient_address,
            certificate_text,
            issueDirectoryPath
        )
    )

    console.log(generated)

    // if (generated.status) {
    //     // pin the dir with certificate to IPFS
    //     const metadataIpfsHash = await pinOnIPFS(generated.image, recipient)
    //
    //     const transactionHash = await mint(
    //         address,
    //         `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
    //     )
    //
    //     const userId = getCurrentUserId(req)!
    //
    //     const store = await storeOnDB(
    //         userId,
    //         generated.image,
    //         recipient,
    //         address,
    //         transactionHash
    //     )
    //
    //     if (store) {
    //         return res.status(201).json({
    //             message: "Certificate generated!",
    //         })
    //     } else {
    //         return res
    //             .status(400)
    //             .json({ messgae: "Certificate generation failed." })
    //     }
    // } else {
    //     return res
    //         .status(500)
    //         .json({ messgae: "Certificate generation failed." })
    // }
}

async function generateFromTemplate(
    template: string,
    certificate_type: string,
    recipient_name: string,
    recipient_address: string,
    certificate_text: string,
    issueDirectoryPath: string
) {
    const issuer_address = process.env.OWNER_ADDRESS

    const monaSansFont32 = await Jimp.loadFont("fonts/monasans-32/monasans.fnt")
    const monaSansFont20 = await Jimp.loadFont("fonts/monasans-20/monasans.fnt")
    const monaSansFont14 = await Jimp.loadFont("fonts/monasans-14/monasans.fnt")
    const cookieFont56 = await Jimp.loadFont("fonts/cookie-56/cookie.fnt")

    const img = await Jimp.read(template)

    let recipient_name_coordinates = { x: 280, y: 370 }

    if (recipient_name.length <= 30) {
        recipient_name_coordinates = { x: 280, y: 370 }
    }

    if (recipient_name.length <= 20) {
        recipient_name_coordinates = { x: 370, y: 370 }
    }

    if (recipient_name.length <= 10) {
        recipient_name_coordinates = { x: 450, y: 370 }
    }

    const templateValues = [
        {
            certificate_type: certificate_type,
            x: 420,
            y: 188,
            angle: 0,
            color: "#6D6FF3",
            font: monaSansFont32,
            width: img.bitmap.width,
            height: img.bitmap.height,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        {
            recipient_name: recipient_name,
            ...recipient_name_coordinates,
            angle: 0,
            color: "#6D6FF3",
            font: cookieFont56,
            width: img.bitmap.width,
            height: img.bitmap.height,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        {
            recipient_address: recipient_address,
            x: 140,
            y: 690,
            angle: 0,
            color: "#6D6FF3",
            font: monaSansFont14,
            width: img.bitmap.width,
            height: img.bitmap.height,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        {
            certificate_text: certificate_text,
            x: 210,
            y: 505,
            angle: 0,
            color: "#8E8E8E",
            font: monaSansFont20,
            width: 620,
            height: 125,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        {
            issuer_address: issuer_address,
            x: 630,
            y: 690,
            angle: 0,
            color: "#6D6FF3",
            font: monaSansFont14,
            width: img.bitmap.width,
            height: img.bitmap.height,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
    ]

    for (const value of templateValues) {
        const keys = Object.keys(value) // Get all keys of the current object
        const firstKey = keys[0] // Get the first key

        const val = value[firstKey as keyof typeof value] // Get the value corresponding to the first key
        const {
            x,
            y,
            angle,
            color,
            font,
            width,
            height,
            alignmentX,
            alignmentY,
        } = value // Destructure the rest of the properties

        const xInt = typeof x === "string" ? parseInt(x, 10) : x
        const yInt = typeof y === "string" ? parseInt(y, 10) : y
        const angleInt = typeof angle === "string" ? parseInt(angle, 10) : angle

        let textImage = await Jimp.create(width, height)

        textImage.print(
            font,
            0,
            0,
            {
                text: val,
                alignmentX: alignmentX,
                alignmentY: alignmentY,
            },
            width,
            height
        )
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

    const recipient_name_slug = generateSlug(recipient_name)

    return await img
        .writeAsync(
            `${issueDirectoryPath}/certificate-${recipient_name_slug}-${recipient_address}.png`
        )
        .then((_) => {
            return JSON.stringify({
                status: true,
                image: `${issueDirectoryPath}/certificate-${recipient_name_slug}-${recipient_address}.png`,
            })
        })
        .catch((err) => {
            return JSON.stringify({
                status: false,
                error: err,
            })
        })
}

async function generate(image: string, fields: Fields, storeInDir: string) {
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

    return await img
        .writeAsync(`${storeInDir}/certificate-${image}`)
        .then((_) => {
            return JSON.stringify({
                status: true,
                image: `${storeInDir}/certificate-${image}`,
            })
        })
        .catch((err) => {
            return JSON.stringify({
                status: false,
                error: err,
            })
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
