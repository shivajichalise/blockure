import { useState, FC, MouseEventHandler, useEffect } from "react"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    HomeOutlined,
} from "@ant-design/icons"
import {
    Space,
    MenuProps,
    Button,
    Layout,
    Menu,
    Image,
    Flex,
    Dropdown,
} from "antd"
import longLogo from "../assets/long-logo.png"
import smallLogo from "../assets/logo.png"
import { DownOutlined } from "@ant-design/icons"
import { useAuth } from "../contexts/AuthContext"
import CertificateContent from "../components/CertificateContent"

const { Header, Sider } = Layout

const Home: FC = () => {
    const [collapsed, setCollapsed] = useState(false)

    const { user, logout } = useAuth()

    const [logo, setLogo] = useState(longLogo)
    const [logoSize, setLogoSize] = useState(150)

    const handleLogout: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault()
        logout()
    }

    const [selectedMenu, setSelectedMenu] = useState("1")

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

    useEffect(() => {
        if (collapsed) {
            setLogo(smallLogo)
            setLogoSize(40)
        } else {
            setLogo(longLogo)
            setLogoSize(150)
        }
    }, [collapsed])

    return (
        <Layout
            hasSider
            style={{ background: "rgba(0,0,0,0)", minHeight: "100vh" }}
        >
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: "rgba(0,0,0,0)",
                    borderRight: "1px solid #9FA7AE",
                }}
            >
                <Flex
                    justify="center"
                    align="center"
                    style={{ margin: "1rem" }}
                >
                    <Image src={logo} preview={false} width={logoSize} />
                </Flex>
                <Menu
                    theme="dark"
                    mode="inline"
                    style={{
                        background: "rgba(0,0,0,0)",
                    }}
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <HomeOutlined />,
                            label: "Home",
                        },
                        {
                            key: "2",
                            icon: <SafetyCertificateOutlined />,
                            label: "Certificates",
                        },
                        {
                            key: "3",
                            icon: <UserOutlined />,
                            label: "Users",
                        },
                    ]}
                    onClick={({ key }) => {
                        setSelectedMenu(key)
                    }}
                />
            </Sider>
            <Layout
                style={{
                    background: "rgba(0,0,0,0)",
                }}
            >
                <Header
                    className=""
                    style={{ paddingLeft: 0, background: "rgba(0,0,0,0)" }}
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
                {selectedMenu === "2" ? <CertificateContent /> : ""}
            </Layout>
        </Layout>
    )
}

export default Home
