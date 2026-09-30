import {
  createBrowserRouter,
} from "react-router";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Budgets from "../pages/Budgets";
import Profile from "../pages/Profile";

import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/ProtectedRoute";

const router =
  createBrowserRouter([
    {
      path: "/",
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
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },

    {
      path: "/transactions",
      element: (
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      ),
    },

    {
      path: "/budgets",
      element: (
        <ProtectedRoute>
          <Budgets />
        </ProtectedRoute>
      ),
    },

    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);

export default router;