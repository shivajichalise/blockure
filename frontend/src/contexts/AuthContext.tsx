import {
    Dispatch,
    SetStateAction,
    createContext,
    PropsWithChildren,
    useContext,
    useState,
} from "react"

import User from "../types/User"

type ContextData = {
    user: User | null
    token: string | null
    setUser: Dispatch<SetStateAction<User | null>>
    setToken: (token: string | null) => void
}

const initialState: ContextData = {
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
}

const AuthContext = createContext(initialState)

type AuthProviderProps = PropsWithChildren & {
    isSignedIn?: boolean
}

export default function AuthProvider({
    children,
    isSignedIn,
}: AuthProviderProps) {
    // Uses `isSignedIn` prop to determine whether or not to render a user
    const [user, setUser] = useState<User | null>(isSignedIn ? { id: 1 } : null)
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"))

    function setToken(token: string | null) {
        _setToken(token)

        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token)
        } else {
            localStorage.removeItem("ACCESS_TOKEN")
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, setUser, setToken }}>
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
