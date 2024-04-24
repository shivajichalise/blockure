import { Button, Card, Flex, Form, Input, Upload, UploadProps } from "antd"
import CertificateInput from "./CertificateInput"
import {
    PlusOutlined,
    UploadOutlined,
    LoadingOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { Modal, message } from "antd"
import type { GetProp } from "antd"
import { InputStatus } from "antd/es/_util/statusUtils"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => callback(reader.result as string))
    reader.readAsDataURL(img)
}

const CreateCertificateContent = () => {
    const [form] = Form.useForm()
    const [fieldLabels, setFieldLabels] = useState(["Name"])

    const handleAdd = (label: string) => {
        setFieldLabels([...fieldLabels, label])
    }

    const handleRemove = (label: string) => {
        setFieldLabels(fieldLabels.filter((l) => l !== label))
    }

    const submitForm = (values: any) => {
        console.log(values)
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newLabel, setNewLabel] = useState<string>("")
    const [newLabelStatus, setNewLabelStatus] = useState<InputStatus>("")
    const [messageApi, contextHolder] = message.useMessage()
    const [errorMessage, setErrorMessage] = useState("Label cannot be empty!")

    const error = (message: string) => {
        messageApi.open({
            type: "error",
            content: message,
        })
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        if (newLabel.length === 0) {
            setNewLabelStatus("error")
            error(errorMessage)
        } else {
            if (fieldLabels.includes(newLabel)) {
                setErrorMessage("Label has been already used!")
                setNewLabelStatus("error")
                error(errorMessage)
            } else {
                handleAdd(newLabel)
                setNewLabelStatus("")
                setIsModalOpen(false)
            }
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(e.target.value)
    }

    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [imageName, setImageName] = useState<string>("")

    const uploadProps: UploadProps = {
        name: "certificate",
        action: `${import.meta.env.VITE_API_URL}/api/certificates/upload`,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        onChange(info) {
            if (info.file.status == "uploading") {
                console.log(info.file, info.fileList)
                setLoading(true)
                return
            }

            if (info.file.status === "done") {
                setLoading(false)
                message.success(`${info.file.name} file uploaded successfully`)
                if (info.file.status === "done") {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj as FileType, (url) => {
                        setImageUrl(url)
                    })
                    setImageName(info.file.response.certificate)
                }
            } else if (info.file.status === "error") {
                setLoading(false)
                message.error(`${info.file.name} file upload failed.`)
            }
        },
    }

    return (
        <Flex
            justify="center"
            align="center"
            style={{
                width: "95%",
                marginBottom: "2rem",
            }}
        >
            {contextHolder}
            <Modal
                title="Enter label"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    size="large"
                    placeholder="Label"
                    status={newLabelStatus}
                    onChange={handleLabelInputChange}
                />
            </Modal>
            <Flex
                justify="space-around"
                align="center"
                wrap="wrap"
                style={{ width: "100%" }}
            >
                <Flex
                    className="glass2"
                    justify="center"
                    align="center"
                    style={{
                        width: "55%",
                    }}
                >
                    <Card
                        title="Enter details"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={showModal}
                            />
                        }
                        style={{
                            width: "100%",
                            background: "rgba(0,0,0,0)",
                        }}
                    >
                        <Form form={form} onFinish={submitForm}>
                            {fieldLabels.map((e, i) => {
                                return (
                                    <CertificateInput
                                        key={i}
                                        label={e}
                                        handleRemove={handleRemove}
                                    />
                                )
                            })}
                            <Form.Item>
                                <Upload {...uploadProps}>
                                    <Button
                                        icon={
                                            loading ? (
                                                <LoadingOutlined />
                                            ) : (
                                                <UploadOutlined />
                                            )
                                        }
                                    >
                                        Upload Certificate
                                    </Button>
                                </Upload>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Create
                            </Button>
                        </Form>
                    </Card>
                </Flex>
                <Flex
                    justify="center"
                    align="center"
                    style={{
                        width: "40%",
                        height: "25rem",
                        border: "1px solid #B7B7B7",
                        borderRadius: 20,
                    }}
                >
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%", borderRadius: 10 }}
                    />
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreateCertificateContent
