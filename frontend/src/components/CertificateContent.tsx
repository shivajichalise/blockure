import { FC } from "react"
import { Table, Space, Card } from "antd"
import type { TableProps } from "antd"
import { EyeFilled, PlusSquareFilled } from "@ant-design/icons"

const CertificateContent: FC = () => {
    interface DataType {
        key: string
        issued_by: string
        issued_on: string
        id: string
    }

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "#",
            dataIndex: "key",
            rowScope: "row",
        },
        {
            title: "Issued by",
            dataIndex: "issued_by",
            key: "issued_by",
        },
        {
            title: "Issued on",
            dataIndex: "issued_on",
            key: "issued_on",
        },
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
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
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
    ]

    return (
        <Card
            title="Manage Certificates"
            bordered={false}
            style={{ width: "95%", marginBottom: "2rem" }}
            extra={
                <a href="/certificates/create" style={{ fontSize: "1rem" }}>
                    <PlusSquareFilled />
                </a>
            }
        >
            <Table columns={columns} dataSource={data} />
        </Card>
    )
}

export default CertificateContent
