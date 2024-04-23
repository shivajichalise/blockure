import { Button, Card, Col, Flex, Form, Row, Typography } from "antd"
import CertificateInput from "./CertificateInput"
import { PlusOutlined } from "@ant-design/icons"

const CreateCertificateContent = () => {
    return (
        <Flex
            justify="center"
            align="center"
            style={{
                width: "95%",
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
                            />
                        }
                        style={{
                            width: "100%",
                            background: "rgba(0,0,0,0)",
                        }}
                    >
                        <CertificateInput />
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
