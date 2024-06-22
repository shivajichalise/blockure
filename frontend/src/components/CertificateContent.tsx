import { FC, useEffect, useState } from "react"
import { Table, Space, Card } from "antd"
import type { TableProps } from "antd"
import { BlockOutlined, EyeFilled, PlusSquareFilled } from "@ant-design/icons"
import { Link } from "react-router-dom"
import axiosClient from "../axios-client"

interface DataType {
    key: string
    issuer: string
    certificate: string
    issued_to: string
    issued_address: string
    transaction_hash: string
}

const CertificateContent: FC = () => {
    const [data, setData] = useState<DataType[]>([])

    function fetchData() {
        axiosClient
            .get("/certificates")
            .then(({ data }) => {
                console.log(data)
                setData(data.certificates)
            })
            .catch((err) => {
                const response = err.response
                if (response && response.status === 403) {
                    console.error(response.data.data)
                }
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "#",
            dataIndex: "key",
            rowScope: "row",
            fixed: "left",
            width: 40,
        },
        {
            title: "Issuer",
            dataIndex: "issuer",
            key: "issuer",
        },
        {
            title: "Certificate",
            dataIndex: "certificate",
            key: "certificate",
        },
        {
            title: "Issued to",
            dataIndex: "issued_to",
            key: "issued_to",
        },
        {
            title: "Issued address",
            dataIndex: "issued_address",
            key: "issued_address",
        },
        {
            title: "Transaction Hash",
            dataIndex: "transaction_hash",
            key: "transaction_hash",
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 80,
            render: (_, record) => (
                <Space size="middle">
                    <a
                        href={`https://sepolia.etherscan.io/tx/${record.transaction_hash}`}
                        target="_blank"
                    >
                        <BlockOutlined />
                    </a>
                    <a
                        href={`https://sepolia.etherscan.io/tx/${record.transaction_hash}`}
                        target="_blank"
                    >
                        <EyeFilled />
                    </a>
                </Space>
            ),
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
            <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />
        </Card>
    )
}

export default CertificateContent
