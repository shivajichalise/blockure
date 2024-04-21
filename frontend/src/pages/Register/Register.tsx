import {
    Button,
    Flex,
    Form,
    Input,
    Typography,
    Image,
    Space,
    Spin,
    Row,
    Col,
} from "antd"
import { MailOutlined, UserOutlined } from "@ant-design/icons"
import logo from "../../assets/logo.png"
import { useState, useEffect, FC } from "react"
import "./styles.css"
const { Text, Link } = Typography
import axiosClient from "../../axios-client"
import { useAuth } from "../../contexts/AuthContext"

const Register: FC = () => {
    const [form] = Form.useForm()
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
    const [titleSize, setTitleSize] = useState<2 | 5 | 1 | 3 | 4 | undefined>(2)
    const { setUser, setToken } = useAuth()
    const [loginError, setRegisterError] = useState<string>(
        "Invalid email or password!"
    )
    const [spinning, setSpinning] = useState<boolean>(false)

    const submitForm = (values: any) => {
        setSpinning(true)

        const { email, password } = values

        const payload = {
            email,
            password,
        }

        axiosClient
            .post("/auth/login", payload)
            .then(({ data }) => {
                const userId = data._id
                const token = data.token

                setUser(userId)
                setToken(token)

                setSpinning(false)
            })
            .catch((err) => {
                const response = err.response
                if (response && response.status === 401) {
                    setRegisterError(response.data.message)
                    form.setFields([
                        {
                            name: "email",
                            value: values.email,
                            errors: [loginError],
                        },
                        {
                            name: "password",
                            value: "",
                            errors: [],
                        },
                    ])
                    setSpinning(false)
                }
            })
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setTitleSize(4)
            } else {
                setTitleSize(2)
            }
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <Flex justify="center" align="center" id="container">
            <Spin spinning={spinning} fullscreen />
            <Flex
                justify="center"
                align="center"
                style={{
                    width: "60%",
                    height: "70%",
                    padding: "0 4rem 0 4rem",
                    border: "1px solid #B7B7B7",
                    borderRadius: 20,
                    margin: 15,
                }}
            >
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    size="large"
                    onFinish={submitForm}
                >
                    <Flex
                        justify="center"
                        align="center"
                        style={{ marginBottom: "1rem" }}
                    >
                        <Image src={logo} preview={false} width={50} />
                    </Flex>
                    <Form.Item>
                        <Typography.Title
                            level={titleSize}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: 0,
                            }}
                        >
                            Create an account
                        </Typography.Title>
                    </Form.Item>
                    <Flex justify="center" align="center">
                        <Row gutter={16} style={{ width: "80%" }}>
                            <Col xs={24} md={24} lg={12}>
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Name field is required!",
                                        },
                                    ]}
                                >
                                    <Input
                                        suffix={
                                            <UserOutlined
                                                style={{ color: "gray" }}
                                            />
                                        }
                                        placeholder="Name"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={12}>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Email field is required!",
                                        },
                                    ]}
                                >
                                    <Input
                                        suffix={
                                            <MailOutlined
                                                style={{ color: "gray" }}
                                            />
                                        }
                                        placeholder="Email"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={12}>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Password field is required!",
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="Password"
                                        visibilityToggle={{
                                            visible: passwordVisible,
                                            onVisibleChange: setPasswordVisible,
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={12}>
                                <Form.Item
                                    name="password_confirmation"
                                    dependencies={["password"]}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please confirm your password!",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue(
                                                        "password"
                                                    ) === value
                                                ) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        "The password that you entered do not match!"
                                                    )
                                                )
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        placeholder="Password"
                                        visibilityToggle={{
                                            visible: passwordVisible,
                                            onVisibleChange: setPasswordVisible,
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Flex>
                    <Form.Item
                        style={{
                            marginBottom: "0px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            id="register-button"
                            type="primary"
                            htmlType="submit"
                            className="signup-form-button"
                            block
                        >
                            Register
                        </Button>
                    </Form.Item>

                    <Form.Item
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Space direction="horizontal">
                            <Text>Already have an account?</Text>
                            <Link href="/login">Login</Link>
                        </Space>
                    </Form.Item>
                </Form>
            </Flex>
        </Flex>
    )
}

export default Register
