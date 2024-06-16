import { Button, Spin, Card, Flex, Form } from "antd"
import { useState } from "react"
import { message } from "antd"
import axiosClient from "../axios-client"
import InputText from "./InputText"

const CreateCustomCertificate = () => {
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const [spinning, setSpinning] = useState<boolean>(false)

    const submitForm = (values: any) => {
        setSpinning(true)

        const payload = {
            transactionHash: values["transactionHash"],
        }

        axiosClient
            .post("/certificates/verify", payload)
            .then(({ data }) => {
                setSpinning(false)
                message.success(`${data.message}`)
                console.log("FRONTEND DATA", data)
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
                width: "95%",
                marginBottom: "2rem",
            }}
        >
            <Spin spinning={spinning} fullscreen />
            {contextHolder}
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
                        style={{
                            width: "100%",
                            background: "rgba(0,0,0,0)",
                        }}
                    >
                        <Form form={form} onFinish={submitForm}>
                            <InputText
                                label="Transaction hash"
                                placeholder="Transaction hash"
                                name="transactionHash"
                            />

                            <Button type="primary" htmlType="submit" block>
                                Create
                            </Button>
                        </Form>
                    </Card>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreateCustomCertificate
