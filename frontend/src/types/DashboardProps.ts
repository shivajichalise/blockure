import { ReactElement } from "react"
import { MenuClickEventHandler } from "rc-menu/lib/interface"

interface DashboardProps {
    children: ReactElement
    page: string
    handleMenuChange: MenuClickEventHandler
}

export default DashboardProps
