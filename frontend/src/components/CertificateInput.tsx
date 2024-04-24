import {
    Input,
    Space,
    Flex,
    Button,
    ColorPicker,
    Typography,
    InputNumber,
    Form,
} from "antd"
import { CloseOutlined } from "@ant-design/icons"
import CertificateInputProps from "../types/CertificateInputProps"
import { useState, useEffect } from "react"
import CertificateInputFields from "../types/CertificateInputFields"

const CertificateInput = ({ label, handleRemove }: CertificateInputProps) => {
    const [formData, setFormData] = useState<CertificateInputFields>({})

    const removeData = (label: string) => {
        setFormData((prevState) => {
            const newState = { ...prevState }
            delete newState[label]
            return newState
        })

        handleRemove(label)
    }

    useEffect(() => {}, [formData])

    return (
        <Flex
            style={{ marginBottom: "2rem", height: "100%", width: "100%" }}
            justify="space-between"
            align="center"
        >
            <Flex style={{ flexDirection: "column", width: "100%" }}>
                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginBottom: "0.5rem" }}
                >
                    <Typography.Text
                        disabled
                        style={{
                            fontSize: "0.8rem",
                            margin: "0 0.5rem 0rem 0.1rem",
                        }}
                    >
                        {label}:
                    </Typography.Text>

                    <Button
                        type="dashed"
                        shape="circle"
                        icon={<CloseOutlined />}
                        size="small"
                        onClick={() => removeData(label)}
                    />
                </Flex>
                <Form.Item name={`${label}_value`} style={{ margin: "0px" }}>
                    <Input placeholder="Value" className="glass" />
                </Form.Item>
                <Space.Compact
                    direction="horizontal"
                    style={{
                        marginTop: "0.5rem",
                    }}
                    block
                >
                    <Form.Item name={`${label}_x`}>
                        <InputNumber
                            className="glass"
                            placeholder="X coord"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name={`${label}_y`}>
                        <InputNumber
                            className="glass"
                            placeholder="Y coord"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name={`${label}_angle`}>
                        <InputNumber
                            className="glass"
                            placeholder="Angle"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name={`${label}_color`}
                        getValueFromEvent={(color) => {
                            return "#" + color.toHex()
                        }}
                    >
                        <ColorPicker
                            className="glass"
                            showText
                            style={{
                                borderTopRightRadius: "5px",
                                borderTopLeftRadius: "0",
                                borderBottomLeftRadius: "0",
                                borderBottomRightRadius: "5px",
                                width: "100%",
                            }}
                        />
                    </Form.Item>
                </Space.Compact>
            </Flex>
        </Flex>
    )
}

export default CertificateInput
