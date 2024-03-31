import app from "./main"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.ENV} mode on port ${PORT}`)
})
