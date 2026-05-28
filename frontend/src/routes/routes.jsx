import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Dashboard from "../component/Dashboard/Dashboard";
import AdminProfile from "../pages/AdminProfile";
import SuperAdminDashboard from "../component/Dashboard/SuperAdminDashboard";
import ServiceExpired from "../pages/ServiceExpired";
import PrivateRoute from "../component/comman/PrivateRoute";
import Register from "../pages/Register";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/superadmin/dashboard",
        element: (
          <PrivateRoute superAdminOnly={true}>
            <SuperAdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/register",
        element: (
          <PrivateRoute adminOnly={true}>
            <Register />
          </PrivateRoute>
        ),
      },
      {
        path: "/service-expired",
        element: <ServiceExpired />
      },
      {
        path: "/admin/profile",
        element: (
          <PrivateRoute adminOnly={true}>
            <AdminProfile />
          </PrivateRoute>
        ),
      },
    ],
  },
]);