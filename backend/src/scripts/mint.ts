import { ethers } from "ethers"
import "dotenv/config"

// Contract ABI
import contract from "../../ignition/deployments/chain-11155111/artifacts/BlockureModule#Blockure.json"

const ALCHEMY_API_KEY: string = process.env.ALCHEMY_API_KEY!
const METAMASK_PRIVATE_KEY: string = process.env.METAMASK_PRIVATE_KEY!

const provider = new ethers.AlchemyProvider("sepolia", ALCHEMY_API_KEY)
const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider)

const abi = contract.abi
const contractAddress = "0x383aEB787F521f587B6419F85Fd69b3717dCFa24"

const blockureContract = new ethers.Contract(contractAddress, abi, signer)

// Call mint function
const mint = async (
    recipient_name: string,
    recipient_address: string,
    issuer_address: string,
    tokenURI: string
) => {
    let blockureTxn = await blockureContract.mintNFT(
        recipient_address,
        tokenURI
    )
    await blockureTxn.wait()

    let generateCertificate = await blockureContract.generateCertificate(
        blockureTxn.hash,
        recipient_name,
        recipient_address,
        issuer_address,
        Date.now()
    )

    await generateCertificate.wait()

    console.log(
        `Certificate Minted! Check it out at: https://sepolia.etherscan.io/tx/${blockureTxn.hash}`
    )

    return blockureTxn.hash
}

const getCertificateData = async (transaction_hash: string) => {
    let blockureTxn = await blockureContract.getCertificateData(
        transaction_hash
    )

    await blockureTxn.wait()

    console.log(`Certificate Fetched!`, blockureTxn)

    return blockureTxn
}

export { mint, getCertificateData }
