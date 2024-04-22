import { createContext, PropsWithChildren, useContext, useState } from "react"

type ContextData = {
    user: string | null
    token: string | null
    setUser: (user: string | null) => void
    setToken: (token: string | null) => void
    logout: () => void
}

const initialState: ContextData = {
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    logout: () => {},
}

const AuthContext = createContext(initialState)

type AuthProviderProps = PropsWithChildren & {
    isSignedIn?: boolean
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, _setUser] = useState<string | null>(
        localStorage.getItem("USER")
    )
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"))

    function setToken(token: string | null) {
        _setToken(token)

        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token)
        } else {
            localStorage.removeItem("ACCESS_TOKEN")
        }
    }

    function setUser(user: string | null) {
        _setUser(user)

        if (user) {
            localStorage.setItem("USER", user)
        } else {
            localStorage.removeItem("USER")
        }
    }

    function logout() {
        _setToken(null)
        _setUser(null)
        localStorage.removeItem("ACCESS_TOKEN")
        localStorage.removeItem("USER")
    }

    return (
        <AuthContext.Provider
            value={{ user, token, setUser, setToken, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}
