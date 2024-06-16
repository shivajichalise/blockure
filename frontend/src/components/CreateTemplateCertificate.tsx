import { Button, Spin, Card, Flex, Form } from "antd"
import { useState } from "react"
import { message } from "antd"
import { Empty } from "antd"
import axiosClient from "../axios-client"
import InputText from "./InputText"
import InputSelect from "./InputSelect"
import template from "../assets/certificate_template.png"
import InputTextArea from "./InputTextArea"

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
            recipient_name: values["recipient_name"],
            recipient_address: values["recipient_address"],
            certificate_type: values["certificate_type"],
            certificate_text: values["certificate_text"],
        }

        axiosClient
            .post("/certificates/issue/template", payload)
            .then(({ data }) => {
                setSpinning(false)
                console.log("SUCCESS", data)
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
                                name="recipient_name"
                            />

                            <InputText
                                label="Recipient address"
                                placeholder="Recipient address"
                                name="recipient_address"
                            />

                            <InputTextArea
                                name="certificate_text"
                                label="Certificate text"
                                rows={4}
                                placeholder="Certificate text"
                                maxLength={144}
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
                        height: "100%",
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
