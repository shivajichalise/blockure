import {
    Button,
    Spin,
    Card,
    Flex,
    Form,
    Input,
    Upload,
    UploadProps,
} from "antd"
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
import { Empty } from "antd"
import axiosClient from "../axios-client"
import InputText from "./InputText"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => callback(reader.result as string))
    reader.readAsDataURL(img)
}

interface OrganizedData {
    [prefix: string]: { [field: string]: any }
}

const CreateCustomCertificate = () => {
    const [form] = Form.useForm()
    const [fieldLabels, setFieldLabels] = useState(["Name"])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newLabel, setNewLabel] = useState<string>("")
    const [newLabelStatus, setNewLabelStatus] = useState<InputStatus>("")
    const [messageApi, contextHolder] = message.useMessage()
    const [errorMessage, setErrorMessage] = useState("Label cannot be empty!")
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [imageName, setImageName] = useState<string>("")
    const [spinning, setSpinning] = useState<boolean>(false)

    const handleAdd = (label: string) => {
        setFieldLabels([...fieldLabels, label])
    }

    const handleRemove = (label: string) => {
        setFieldLabels(fieldLabels.filter((l) => l !== label))
    }

    const submitForm = (values: any) => {
        setSpinning(true)
        const organizedData: OrganizedData = {}

        if (imageUrl.length === 0) {
            message.error(`Upload certificate template to continue.`)
            return
        }

        /*
          The data that the form gives is in format:
          {
            Name_value: "Shivaji Chalise",
            Name_x: 10,
            Name_y: 20
            .
            .
          }

          to convert the data into needed format below method is needed
           */
        for (const key in values) {
            if (key !== "address" && key !== "recipient") {
                const [prefix, field] = key.split("_")

                if (!organizedData[prefix]) {
                    organizedData[prefix] = {}
                }

                organizedData[prefix][field] = values[key]
            }
        }

        const payload = {
            fields: organizedData,
            certificate: imageName,
            address: values["address"],
            recipient: values["recipient"],
        }

        axiosClient
            .post("/certificates/issue", payload)
            .then(({ data }) => {
                setSpinning(false)
                message.success(`${data.message}`)
            })
            .catch((err) => {
                const response = err.response
                if (response && response.status === 401) {
                    console.log(response.message())
                }
                setSpinning(false)
                message.success(`${response.message}`)
            })
    }

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

    const uploadProps: UploadProps = {
        name: "certificate",
        action: `${import.meta.env.VITE_API_URL}/api/certificates/upload`,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        onChange(info) {
            if (info.file.status == "uploading") {
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
            <Spin spinning={spinning} fullscreen />
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
                            <InputText
                                label="Recipient name"
                                placeholder="Recipient name"
                                name="recipient"
                            />

                            <InputText
                                label="Recipient address"
                                placeholder="Recipient address"
                                name="address"
                            />

                            {fieldLabels.map((e, i) => {
                                return (
                                    <CertificateInput
                                        key={i}
                                        label={e}
                                        handleRemove={handleRemove}
                                        form={form}
                                    />
                                )
                            })}
                            <Form.Item>
                                <Upload {...uploadProps} showUploadList={false}>
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
                        height: "34rem",
                        border: "1px solid #B7B7B7",
                        borderRadius: 10,
                    }}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 10,
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <Empty description={false} />
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default CreateCustomCertificate
