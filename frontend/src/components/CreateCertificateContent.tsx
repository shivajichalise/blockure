import { Button, Card, Flex, Form } from "antd"
import CertificateInput from "./CertificateInput"
import { PlusOutlined } from "@ant-design/icons"
import { useState } from "react"

function generateRandomString() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const length = Math.floor(Math.random() * 2) + 4 // Random length between 4 and 5

    let result = ""
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        )
    }
    return result
}

const CreateCertificateContent = () => {
    const [form] = Form.useForm()
    const [fieldLabels, setFieldLabels] = useState(["Name"])

    const handleAdd = () => {
        const label = generateRandomString()
        setFieldLabels([...fieldLabels, label])
    }

    const handleRemove = (label: string) => {
        setFieldLabels(fieldLabels.filter((l) => l !== label))
    }

    const submitForm = (values: any) => {
        console.log(values)
    }

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                width: "95%",
                marginBottom: "2rem",
            }}
        >
            <Flex
                justify="space-around"
                align="center"
                wrap="wrap"
                style={{ width: "100%" }}
            >
                <Flex
                    className="glass2"
                    justify="center"
                    align="center"
                    style={{
                        width: "55%",
                    }}
                >
                    <Card
                        title="Enter details"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={handleAdd}
                            />
                        }
                        style={{
                            width: "100%",
                            background: "rgba(0,0,0,0)",
                        }}
                    >
                        <Form form={form} onFinish={submitForm}>
                            {fieldLabels.map((e, i) => {
                                return (
                                    <CertificateInput
                                        key={i}
                                        label={e}
                                        handleRemove={handleRemove}
                                    />
                                )
                            })}
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                block
                            >
                                Log in
                            </Button>
                        </Form>
                    </Card>
                </Flex>
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        backgroundColor: "#0ff",
                        width: "40%",
                        border: "1px solid #B7B7B7",
                        borderRadius: 20,
                    }}
                >
                    <h1>hello</h1>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreateCertificateContent
