import { Button, Flex, Form, Input, Typography, Image, Space, Spin } from "antd"
import { MailOutlined } from "@ant-design/icons"
import image from "../../assets/login_screen_image.png"
import logo from "../../assets/logo.png"
import { useState, useEffect, FC } from "react"
import "./styles.css"
const { Text, Link } = Typography
import axiosClient from "../../axios-client"
import { useAuth } from "../../contexts/AuthContext"

const Login: FC = () => {
    const [form] = Form.useForm()
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
    const [titleSize, setTitleSize] = useState<2 | 5 | 1 | 3 | 4 | undefined>(2)
    const { setUser, setToken } = useAuth()
    const [loginError, setLoginError] = useState<string>(
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
                    setLoginError(response.data.message)
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
                justify="space-evenly"
                align="center"
                style={{ height: "70%" }}
            >
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        height: "100%",
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
                                Login to your account
                            </Typography.Title>
                        </Form.Item>
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
                                    <MailOutlined style={{ color: "gray" }} />
                                }
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Password field is required!",
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
                        <Form.Item>
                            <a className="login-form-forgot" href="">
                                Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item
                            style={{
                                marginBottom: "0px",
                            }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                block
                            >
                                Log in
                            </Button>
                        </Form.Item>

                        <Form.Item
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Space direction="horizontal">
                                <Text>No account?</Text>
                                <Link href="/register">Create one</Link>
                            </Space>
                        </Form.Item>
                    </Form>
                </Flex>
                <Flex justify="center" align="center" id="image">
                    <Image
                        src={image}
                        height="100%"
                        width="100%"
                        preview={false}
                        style={{ borderRadius: 20 }}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Login
