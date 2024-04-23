import {
    UserOutlined,
    SafetyCertificateOutlined,
    DashboardOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"

const menus = [
    {
        key: "1",
        icon: <DashboardOutlined />,
        label: (
            <Link to="/" rel="noopener noreferrer">
                Home
            </Link>
        ),
        text: "Home",
    },
    {
        key: "2",
        icon: <SafetyCertificateOutlined />,
        label: (
            <Link to="/certificates" rel="noopener noreferrer">
                Certificates
            </Link>
        ),
        text: "Certificates",
    },
    {
        key: "3",
        icon: <UserOutlined />,
        label: (
            <Link to="/users" rel="noopener noreferrer">
                Users
            </Link>
        ),
        text: "Users",
    },
]

export default menus
