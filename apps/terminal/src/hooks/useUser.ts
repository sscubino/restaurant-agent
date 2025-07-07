import axios, { AxiosError } from "axios";
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
      await axios.post(`${baseUrl}/api/auth/register`, dataUser);
      navigate("/login");
      return true;
    } catch (error: any) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const handleLogin = async (dataLogin: ILogin) => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/auth/login`, dataLogin);

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
      const { data } = await axios.get(`${baseUrl}/api/auth/profile`, {
        headers: { Authorization: "Bearer " + token },
      });

      Dispatch(onLoadUserInfo(data));
    } catch (error: any) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/resend-verification-email`);
      toast.success("Verification email resent.");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong.");
      }
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
    resendVerificationEmail,
    loading,
  };
};

export default useUser;
