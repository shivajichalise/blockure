export type InputSelectOptions = { label: string; value: string }[]

interface InputSelectProps {
    name: string
    label: string
    placeholder: string
    options: InputSelectOptions
}

export default InputSelectProps
