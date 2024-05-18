import { useState } from "react"
import type { MenuProps } from "antd"
import { Button, Dropdown, Space, Flex } from "antd"
import CreateTemplateCertificate from "./CreateTemplateCertificate"
import CreateCustomCertificate from "./CreateCustomCertificate"

const CreateCertificateContent = () => {
    type CertificateStyleType = "template" | "custom"

    const [certificateStyle, setCertificateStyle] =
        useState<CertificateStyleType>("template")

    const changeCertificateStyle = (style: CertificateStyleType) => {
        setCertificateStyle(style)
    }

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <a onClick={() => changeCertificateStyle("template")}>
                    Blockure template
                </a>
            ),
        },
        {
            key: "2",
            label: (
                <a onClick={() => changeCertificateStyle("custom")}>
                    Custom image
                </a>
            ),
        },
    ]

    return (
        <Flex vertical gap={30}>
            <Flex justify="center">
                <Dropdown menu={{ items }} placement="topCenter">
                    <Button>Change certificate style</Button>
                </Dropdown>
            </Flex>

            {certificateStyle === "template" ? (
                <CreateTemplateCertificate />
            ) : (
                <CreateCustomCertificate />
            )}
        </Flex>
    )
}

export default CreateCertificateContent
