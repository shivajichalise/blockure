import { Button, Flex, Form, Input, Typography, Image, Space } from "antd"
import { MailOutlined } from "@ant-design/icons"
import image from "../../assets/login_screen_image.png"
import logo from "../../assets/logo.png"
import { useState, useEffect, FC } from "react"
import "./styles.css"
const { Text, Link } = Typography
import axiosClient from "../../axios-client"
import { useAuth } from "../../contexts/AuthContext"

const Login: FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [titleSize, setTitleSize] = useState<2 | 5 | 1 | 3 | 4 | undefined>(2)
    const { setUser, setToken } = useAuth()

    const submitForm = (values: any) => {
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
            })
            .catch((err) => {
                const response = err.response
                if (response && response.status === 403) {
                    console.log(response.data.data)
                    console.log(response.data.message)
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
                                    message: "Please input your Password!",
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
                                <Link>Create one</Link>
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
