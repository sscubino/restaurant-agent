import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import DashboardLayout from "@/components/Layout";
import { routeTitles } from "@/config/routes";
import { RoutePaths } from "@/config/types";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedLayout: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (isLoggedIn === false) {
    return <Navigate to={RoutePaths.LOGIN} replace />;
  }

  const title = routeTitles[location.pathname] || "Admin Dashboard";

  return (
    <DashboardLayout title={title}>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedLayout;
