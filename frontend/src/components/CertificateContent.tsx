import { FC } from "react"
import { Table, Space, Card } from "antd"
import type { TableProps } from "antd"
import { EyeFilled, PlusSquareFilled } from "@ant-design/icons"
import { Link } from "react-router-dom"

const CertificateContent: FC = () => {
    interface DataType {
        key: string
        issued_to: string
        issued_on: string
        address: string
    }

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "#",
            dataIndex: "key",
            rowScope: "row",
        },
        {
            title: "Issued to",
            dataIndex: "issued_to",
            key: "issued_to",
        },
        {
            title: "Issued on",
            dataIndex: "issued_on",
            key: "issued_on",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Action",
            key: "action",
            render: (_, __) => (
                <Space size="middle">
                    <a>
                        <EyeFilled />
                    </a>
                </Space>
            ),
        },
    ]

    const data: DataType[] = [
        {
            key: "1",
            issued_to: "John Brown",
            issued_on: new Date().toDateString(),
            address: "432jnasdf43ads",
        },
    ]

    return (
        <Card
            title="Manage Certificates"
            bordered={false}
            style={{ width: "95%", marginBottom: "2rem" }}
            extra={
                <Link to="/certificates/create" style={{ fontSize: "1rem" }}>
                    <PlusSquareFilled />
                </Link>
            }
        >
            <Table columns={columns} dataSource={data} />
        </Card>
    )
}

export default CertificateContent
