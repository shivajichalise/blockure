import { Button, Spin, Card, Flex, Form } from "antd"
import { useState } from "react"
import { message } from "antd"
import { Empty } from "antd"
import axiosClient from "../axios-client"
import InputText from "./InputText"

const VerifyCertificate = () => {
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const [spinning, setSpinning] = useState<boolean>(false)
    const [imageUrl, setImageUrl] = useState<string>("")

    const submitForm = (values: any) => {
        setSpinning(true)

        const payload = {
            transactionHash: values["transactionHash"],
        }

        axiosClient
            .post("/certificates/verify", payload)
            .then(({ data }) => {
                setSpinning(false)
                const imageUrl: string = data.data.image_url
                const ipfsImageUrl = imageUrl.replace(
                    "https://gateway.pinata.cloud/",
                    "https://ipfs.io/"
                )
                console.log(data)
                setImageUrl(ipfsImageUrl)
                message.success("Certificate is blockchain verified!")
            })
            .catch((err) => {
                const response = err.response
                if (response && response.status === 401) {
                    console.log(response.message())
                }
                setSpinning(false)
                message.error("Invalid certificate hash.")
                setImageUrl("")
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
                                Verify
                            </Button>
                        </Form>
                    </Card>
                </Flex>
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        height: "34rem",
                        width: "100%",
                        border: "1px solid #B7B7B7",
                        borderRadius: 10,
                        marginTop: "2rem",
                    }}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                                objectFit: "contain",
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

export default VerifyCertificate
