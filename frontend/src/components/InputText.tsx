import { Flex, Form, Input, Typography } from "antd"
import InputTextProps from "../types/InputTextProps"

const InputText = ({ label, placeholder, name }: InputTextProps) => {
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
                </Flex>
                <Form.Item
                    name={name}
                    style={{ margin: "0px" }}
                    rules={[
                        {
                            required: true,
                            message: `${label} field is required`,
                        },
                    ]}
                >
                    <Input placeholder={placeholder} className="glass" />
                </Form.Item>
            </Flex>
        </Flex>
    )
}

export default InputText
