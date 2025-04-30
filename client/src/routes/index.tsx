import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import OAuth from "../components/OAuth";
import Workspace from "../pages/Workspace";
import Chat from "../components/Workspace/Chat";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/oauth/:provider",
        element: <OAuth.Callback />,
    },
    {
        path: "/workspace/:workspaceId",
        element: <Workspace />,
        "children": [
            {
                path: "chat/:chatId",
                element: <Chat />
            },
        ]
    },

])


export default router;
