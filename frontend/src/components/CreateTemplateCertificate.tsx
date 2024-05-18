import { Button, Spin, Card, Flex, Form, Input } from "antd"
import { useState } from "react"
import { message } from "antd"
import { Empty } from "antd"
import axiosClient from "../axios-client"
import InputText from "./InputText"
import InputSelect from "./InputSelect"
import template from "../assets/certificate_template.png"
import InputTextArea from "./InputTextArea"

const { TextArea } = Input

const CreateTemplateCertificate = () => {
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const [spinning, setSpinning] = useState<boolean>(false)

    const certificateTypes = [
        { label: "Participation", value: "Participation" },
        { label: "Achievement", value: "Achievement" },
        { label: "Completion", value: "Completion" },
        { label: "Appreciation", value: "Appreciation" },
    ]

    const submitForm = (values: any) => {
        setSpinning(true)

        const payload = {
            address: values["address"],
            recipient: values["recipient"],
        }

        axiosClient
            .post("/certificates/issue", payload)
            .then(({ data }) => {
                setSpinning(false)
                message.success(`${data.message}`)
            })
            .catch((err) => {
                const response = err.response
                if (response && response.status === 401) {
                    console.log(response.message())
                }
                setSpinning(false)
                message.success(`${response.message}`)
            })
    }

    const error = (message: string) => {
        messageApi.open({
            type: "error",
            content: message,
        })
    }

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                width: "100%",
                marginBottom: "2rem",
            }}
        >
            <Spin spinning={spinning} fullscreen />
            {contextHolder}
            <Flex
                justify="space-around"
                align="center"
                wrap="wrap"
                style={{ width: "95%" }}
            >
                <Flex
                    className="glass2"
                    justify="center"
                    align="center"
                    style={{
                        width: "50%",
                    }}
                >
                    <Card
                        title="Enter template details"
                        style={{
                            width: "100%",
                            background: "rgba(0,0,0,0)",
                        }}
                    >
                        <Form form={form} onFinish={submitForm}>
                            <InputSelect
                                label="Certificate type"
                                placeholder="Select certificate type"
                                name="certificate_type"
                                options={certificateTypes}
                            />

                            <InputText
                                label="Recipient name"
                                placeholder="Recipient name"
                                name="recipient"
                            />

                            <InputText
                                label="Recipient address"
                                placeholder="Recipient address"
                                name="address"
                            />

                            <InputTextArea
                                name="text"
                                label="Certificate text"
                                rows={4}
                                placeholder="Certificate text"
                                maxLength={50}
                            />

                            <Button type="primary" htmlType="submit" block>
                                Create
                            </Button>
                        </Form>
                    </Card>
                </Flex>
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        width: "45%",
                        height: "auto",
                        border: "1px solid #B7B7B7",
                        borderRadius: 10,
                    }}
                >
                    {template ? (
                        <img
                            src={template}
                            alt="Certificate Template"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Empty description={false} />
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreateTemplateCertificate
