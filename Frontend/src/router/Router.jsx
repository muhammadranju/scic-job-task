import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <>Not Found</>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
    ],
  },
]);

export default router;
