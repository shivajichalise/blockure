import { FormInstance } from "antd"

interface CertificateInputProps {
    label: string
    handleRemove: (label: string) => void
    form: FormInstance
}

export default CertificateInputProps
