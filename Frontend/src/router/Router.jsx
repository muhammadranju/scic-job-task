import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/root";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import PrivateRoutes from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <>Not Found</>,
    children: [
      {
        path: "home",
        element: (
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        index: true,
        element: <Tasks />,
      },
    ],
  },
]);

export default router;
