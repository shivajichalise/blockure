import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import { vars } from "hardhat/config"

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY")
const METAMASK_PRIVATE_KEY = vars.get("METAMASK_PRIVATE_KEY")

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [`0x${METAMASK_PRIVATE_KEY}`],
        },
    },
}

export default config
