import { Flex, Form, Input, Typography } from "antd"
import InputTextAreaProps from "../types/InputTextAreaProps"

const { TextArea } = Input

const InputTextArea = ({
    label,
    placeholder,
    name,
    rows,
    maxLength,
}: InputTextAreaProps) => {
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
                    <TextArea
                        className="glass"
                        placeholder={placeholder}
                        rows={rows}
                        maxLength={maxLength}
                    />
                </Form.Item>
            </Flex>
        </Flex>
    )
}

export default InputTextArea
