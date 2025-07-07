import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { getItemStorage } from "../utils/storage";
import SideBar from "./SideBar";

const ProtectedLayout = ({ children }: any) => {
  const navigate = useNavigate();
  const { getItemByToken, user } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getItemStorage("token");
      if (token) {
        await getItemByToken(token);
        setIsAuthenticated(true);
      } else {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const subscriptions = user.polarCustomer?.subscriptions || [];

    let hasActiveSubscription = false;
    const now = new Date();
    hasActiveSubscription = Boolean(
      subscriptions.find(
        (subscription: any) =>
          subscription.status === "active" &&
          new Date(subscription.currentPeriodEnd) > now
      )
    );

    if (
      !hasActiveSubscription &&
      isAuthenticated &&
      location.pathname !== "/subscription"
    ) {
      navigate("/subscription");
    } else if (hasActiveSubscription && location.pathname === "/subscription") {
      navigate("/");
    }
  }, [user, navigate, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-full">
      <SideBar />
      <div className="flex-1 w-full h-full p-4 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
