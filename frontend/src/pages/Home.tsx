import { useState, FC, MouseEventHandler, useEffect } from "react"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons"
import {
    Space,
    MenuProps,
    Button,
    Layout,
    Menu,
    theme,
    Image,
    Flex,
    Dropdown,
} from "antd"
import logo from "../assets/long-logo.png"
import { DownOutlined } from "@ant-design/icons"
import { useAuth } from "../contexts/AuthContext"

const { Header, Sider, Content } = Layout

const Home: FC = () => {
    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    const { user, logout } = useAuth()

    const handleLogout: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault()
        logout()
    }

    const items: MenuProps["items"] = [
        {
            label: (
                <a href="/logout" onClick={handleLogout}>
                    Logout
                </a>
            ),
            key: "0",
        },
    ]

    return (
        <Layout hasSider>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: "auto",
                    height: "100vh",
                }}
            >
                <Flex
                    justify="center"
                    align="center"
                    style={{ margin: "1rem" }}
                >
                    <Image src={logo} preview={false} width={150} />
                </Flex>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={[
                        {
                            key: "1",
                            icon: <SafetyCertificateOutlined />,
                            label: "Certificates",
                        },
                        {
                            key: "2",
                            icon: <UserOutlined />,
                            label: "Users",
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{ paddingLeft: 0, background: colorBgContainer }}
                >
                    <Flex justify="space-between">
                        <Flex>
                            <Button
                                type="text"
                                icon={
                                    collapsed ? (
                                        <MenuUnfoldOutlined />
                                    ) : (
                                        <MenuFoldOutlined />
                                    )
                                }
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: "16px",
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Flex>
                        <Flex>
                            <Dropdown
                                menu={{ items }}
                                trigger={["click"]}
                                align={{ offset: [0, -10] }}
                            >
                                <a
                                    onClick={(e) => e.preventDefault()}
                                    style={{ color: "#ffffff" }}
                                >
                                    <Space>
                                        {user ? JSON.parse(user).name : ""}
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                        </Flex>
                    </Flex>
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                ></Content>
            </Layout>
        </Layout>
    )
}

export default Home
