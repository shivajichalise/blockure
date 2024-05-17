import { Request, Response } from "express"
import Certificate from "../models/Certificate"
import { validationResult } from "express-validator"
import path from "path"
import Jimp from "jimp"
import IssuedCertificate, {
    IssuedCertificateDocument,
} from "../models/IssuedCertificate"
import getCurrentUserId from "../utils/getCurrentUserId"
import generateSlug from "../utils/generateSlug"
import { now } from "mongoose"
import pinataSDK, { PinataPinOptions } from "@pinata/sdk"
import fs from "fs"
import mint from "../scripts/mint"
import { UserDocument } from "../models/User"

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

async function pinOnIPFS(dir: string) {
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
        name: "Name",
        description: "des",
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
        const metadataIpfsHash = await pinOnIPFS(generated.image)

        // const transactionHash = await mint(
        //     address,
        //     `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
        // )
        //
        const transactionHash = "adsads"

        const userId = getCurrentUserId(req)!

        const store = await storeOnDB(
            userId,
            "qwertyuiop",
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
