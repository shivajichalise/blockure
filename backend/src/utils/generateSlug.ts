export default function toSlug(text: string) {
    return text.toLowerCase().split(" ").join("-")
}
