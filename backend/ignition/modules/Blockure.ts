import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const BlockureModule = buildModule("BlockureModule", (m) => {
    const initialOwner = "0x9580A9283241E6abe656A59eD44E2AC3E74001C7"

    const blockure = m.contract("Blockure", [initialOwner])

    return { blockure }
})

export default BlockureModule
