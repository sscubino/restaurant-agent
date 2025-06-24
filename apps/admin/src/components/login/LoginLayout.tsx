import { Navigate } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoutePaths } from "@/config/types";
import { useAuth } from "@/contexts/AuthContext";

interface LoginLayoutProps {
  children: React.ReactNode;
}

function LoginLayout({ children }: LoginLayoutProps) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to={RoutePaths.HOME} replace />;
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginLayout;
