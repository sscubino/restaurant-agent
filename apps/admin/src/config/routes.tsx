import type { RouteObject } from "react-router";

import ProtectedLayout from "@/components/ProtectedLayout";
import { RoutePaths } from "@/config/types";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Users from "@/pages/Users";

export const routes: RouteObject[] = [
  {
    path: RoutePaths.LOGIN,
    element: <Login />,
  },
  {
    path: RoutePaths.HOME,
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: RoutePaths.USERS,
        element: <Users />,
      },
    ],
  },
];

export const routeTitles: Record<string, string> = {
  [RoutePaths.HOME]: "Dashboard",
  [RoutePaths.USERS]: "Manage Users",
};
