import { FC } from "react"
import { Breadcrumb, Flex, Layout, Table, Space, Card } from "antd"
import type { TableProps } from "antd"
import { EyeFilled } from "@ant-design/icons"

const { Content } = Layout

const CertificateContent: FC = () => {
    interface DataType {
        key: string
        issued_by: string
        issued_on: string
        id: string
    }

    const columns: TableProps<DataType>["columns"] = [
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
        {
            key: "2",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "3",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "4",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "5",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "6",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "7",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "8",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "9",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "10",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
        {
            key: "11",
            issued_by: "John Brown",
            issued_on: new Date().toDateString(),
            id: "432jnasdf43ads",
        },
    ]

    return (
        <Content>
            <Breadcrumb
                style={{ margin: "0 1rem 1rem 1rem" }}
                items={[
                    {
                        title: "Home",
                    },
                    {
                        title: "Certificate",
                    },
                ]}
            />
            <Flex justify="center" align="center">
                <Card
                    title="Manage Certificates"
                    bordered={false}
                    style={{ width: "95%", marginBottom: "2rem" }}
                    extra={<a href="#">Create</a>}
                >
                    <Table columns={columns} dataSource={data} />
                </Card>
            </Flex>
        </Content>
    )
}

export default CertificateContent
