import { Flex, Form, Select, Typography } from "antd"
import InputSelectProps from "../types/InputSelectProps"

const InputSelect = ({
    label,
    placeholder,
    name,
    options,
}: InputSelectProps) => {
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
                    <Select
                        options={options}
                        className="glass"
                        placeholder={placeholder}
                    />
                </Form.Item>
            </Flex>
        </Flex>
    )
}

export default InputSelect
