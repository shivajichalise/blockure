interface Color {
    red: number
    green: number
    blue: number
}

interface Field {
    value: string
    x: number
    y: number
    angle: number
    color: Color
}

interface CertificateInputFields {
    [fieldName: string]: Field
}

export default CertificateInputFields
