import { Form, Input, Space, Flex, Button, ColorPicker } from "antd"
import { CloseOutlined } from "@ant-design/icons"

const CertificateInput = () => {
    return (
        <Space style={{ marginBottom: "2rem" }}>
            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: "Email field is required!",
                    },
                ]}
                style={{ margin: "0" }}
            >
                <Input placeholder="Value" className="glass" />
                <Space.Compact
                    direction="horizontal"
                    style={{
                        marginTop: "0.5rem",
                    }}
                    block
                >
                    <Input
                        className="glass"
                        style={{ width: "26%" }}
                        placeholder="X coord"
                    />
                    <Input
                        className="glass"
                        style={{ width: "25%" }}
                        placeholder="Y coord"
                    />
                    <Input
                        className="glass"
                        style={{ width: "25%" }}
                        placeholder="Angle"
                    />
                    <ColorPicker
                        className="glass"
                        defaultValue="#1677ff"
                        showText
                        style={{
                            borderTopRightRadius: "5px",
                            borderTopLeftRadius: "0",
                            borderBottomLeftRadius: "0",
                            borderBottomRightRadius: "5px",
                            width: "25%",
                        }}
                    />
                </Space.Compact>
            </Form.Item>
            <Flex style={{ height: "100%" }}>
                <Button
                    type="dashed"
                    shape="circle"
                    icon={<CloseOutlined />}
                    size="small"
                />
            </Flex>
        </Space>
    )
}

export default CertificateInput
