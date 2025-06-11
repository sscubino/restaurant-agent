import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUser from "../hooks/useUser";
import { getItemStorage } from "../utils/storage";
import SideBar from "./SideBar";

const ProtectedLayout = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getItemByToken } = useUser();
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

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-full">
      {location.pathname !== "/login" && <SideBar />}
      <div className="flex-1 w-full h-full p-4 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;
