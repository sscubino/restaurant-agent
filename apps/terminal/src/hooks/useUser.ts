import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  onLoadUser,
  onLoadUserInfo,
} from "../redux/slices/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import { ICreateUser, ILogin } from "./types";
import ApiInstance from "../services/axios/configAxios";
import { useState } from "react";
import { toast } from "sonner";

const useUser = () => {
  const { user, loadingApi } = useSelector((slice: any) => slice.user);
  const [loading, setLoading] = useState(false);

  const Dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleVerifyCode = async (code: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await ApiInstance.post(`${baseUrl}/auth/verify-code`, {
        code: code,
      });
      if (response.status === 200 || response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("error", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendVerifyCode = async () => {
    try {
      setLoading(true);
      const { status } = await ApiInstance.post(
        `${baseUrl}/auth/send-verify-code`
      );
      if (status === 200 || status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("error", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (dataUser: ICreateUser): Promise<boolean> => {
    try {
      const { data } = await axios.post(`${baseUrl}/auth/register`, dataUser);
      if (data.ok) {
        navigate("/login");
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const handleLogin = async (dataLogin: ILogin) => {
    try {
      const { data } = await axios.post(`${baseUrl}/auth/login`, dataLogin);

      if (data.access_token) {
        Dispatch(onLoadUser(data.access_token));
        navigate("/dashbooard");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const getItemByToken = async (token: string) => {
    try {
      const { data } = await axios.get(`${baseUrl}/auth/profile`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (data.ok) {
        Dispatch(onLoadUserInfo(data.user));
      }
    } catch (error: any) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return {
    user,
    loadingApi,
    handleLogin,
    getItemByToken,
    handleRegister,
    handleVerifyCode,
    sendVerifyCode,
    loading,
  };
};

export default useUser;
