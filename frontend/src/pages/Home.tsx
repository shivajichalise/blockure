import { ReactElement, useEffect, useState } from "react"
import Dashboard from "../components/Dashboard"
import menus from "../config/menus"
import { MenuClickEventHandler } from "rc-menu/lib/interface"

const Home = () => {
    const [selectedMenu, setSelectedMenu] = useState("1")
    const [selectedMenuLabel, setSelectedMenuLabel] = useState("Home")
    const [selectedMenuContent, setSelectedMenuContent] =
        useState<ReactElement | null>(null)

    const handleMenuChange: MenuClickEventHandler = ({ key }) => {
        setSelectedMenu(key)
    }

    useEffect(() => {
        const menu = menus.find((menu) => menu.key === selectedMenu)
        const menuName = menu ? menu.label : "Home"
        setSelectedMenuLabel(menuName)

        const menuContent = menu ? menu.content : null
        setSelectedMenuContent(menuContent || null)
    }, [selectedMenu])

    return (
        <Dashboard page={selectedMenuLabel} handleMenuChange={handleMenuChange}>
            {selectedMenuContent ?? <h1>Oops</h1>}
        </Dashboard>
    )
}

export default Home
