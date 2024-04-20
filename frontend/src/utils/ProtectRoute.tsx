import { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

type ProtectedRouteProps = PropsWithChildren

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { token } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (token === null) {
            navigate("/login", { replace: true })
        }
    }, [navigate, token])

    return children
}
