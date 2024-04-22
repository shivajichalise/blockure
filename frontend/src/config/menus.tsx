import {
    UserOutlined,
    SafetyCertificateOutlined,
    DashboardOutlined,
} from "@ant-design/icons"
import CertificateContent from "../components/CertificateContent"

const menus = [
    {
        key: "1",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        content: null,
    },
    {
        key: "2",
        icon: <SafetyCertificateOutlined />,
        label: "Certificates",
        content: <CertificateContent />,
    },
    {
        key: "3",
        icon: <UserOutlined />,
        label: "Users",
    },
]

export default menus
