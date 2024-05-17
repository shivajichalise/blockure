import { ethers } from "ethers"
import "dotenv/config"

// Contract ABI
import contract from "../../ignition/deployments/chain-11155111/artifacts/BlockureModule#Blockure.json"

const ALCHEMY_API_KEY: string = process.env.ALCHEMY_API_KEY!
const METAMASK_PRIVATE_KEY: string = process.env.METAMASK_PRIVATE_KEY!

const provider = new ethers.AlchemyProvider("sepolia", ALCHEMY_API_KEY)
const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider)

const abi = contract.abi
const contractAddress = "0xed463268b333F14CDe51FE8418003A7A2D483Bb1"

const blockureContract = new ethers.Contract(contractAddress, abi, signer)

// Call mint function
const mint = async (to: string, tokenURI: string) => {
    console.log("Aako cha")

    console.log("To address:", to)
    console.log("URL:", tokenURI)

    let blockureTxn = await blockureContract.mintNFT(to, tokenURI)
    await blockureTxn.wait()

    console.log(
        `Certificate Minted! Check it out at: https://sepolia.etherscan.io/tx/${blockureTxn.hash}`
    )

    return blockureTxn.hash
}

export default mint
