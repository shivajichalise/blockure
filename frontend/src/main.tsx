import React from "react"
import ReactDOM from "react-dom/client"
import { ConfigProvider, theme } from "antd"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Home from "./pages/Home.tsx"
import Login from "./pages/Login/Login.tsx"
import GuestPage from "./pages/GuestPage.tsx"
import AuthContext from "./contexts/AuthContext.tsx"
import ProtectedRoute from "./utils/ProtectRoute.tsx"
import Register from "./pages/Register.tsx"
import "./index.css"
import font from "./fonts/Mona-Sans.ttf"

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/",
        element: <GuestPage />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthContext isSignedIn={false}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#6d6ff3",
                        colorInfo: "#6d6ff3",
                        colorBgBase: "#0e0c14",
                        colorTextBase: "#ffffff",
                        colorSuccess: "#b8fd95",
                        sizeUnit: 4,
                        borderRadius: 6,
                        wireframe: false,
                        colorError: "#ff6061",
                        colorWarning: "#ffbf3f",
                        fontSize: 14,
                        fontFamily: font,
                    },
                    algorithm: theme.darkAlgorithm,
                }}
            >
                <RouterProvider router={router} />
            </ConfigProvider>
        </AuthContext>
    </React.StrictMode>
)
