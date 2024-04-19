import { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

type ProtectedRouteProps = PropsWithChildren

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) {
            navigate("/login", { replace: true })
        }
    }, [navigate, user])

    return children
}
