import * as React from "react";
import Input from "../../components/InputField";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

interface IData {
  email: string;
  password: string;
}

const initialState: IData = {
  email: "",
  password: "",
};

const LoginModule = () => {
  const token = localStorage.getItem("token");
  const { handleLogin, loadingApi } = useUser();
  const navigate = useNavigate();
  const [data, setData] = React.useState<IData>(initialState);
  const [errorsForm, setErrorsForm] = React.useState<Record<string, string>>(
    {}
  );

  React.useEffect(() => {
    if (token) {
      navigate("/dashbooard");
    }
  }, []);

  const handleSetData = (key: string, value: string) => {
    setData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setErrorsForm((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  const resetErrors = () => {
    setErrorsForm({});
  };

  const login = async () => {
    if (data.email && data.password) {
      await handleLogin(data);
    } else {
      let errors: Record<string, string> = {};
      if (!data.email) errors.email = "Please enter a valid email";
      if (!data.password) errors.password = "Please enter a valid password";
      setErrorsForm(errors);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-row justify-center items-center"
      onMouseEnter={resetErrors}
      onMouseLeave={resetErrors}
    >
      <div className="flex shadow-xl rounded-[5px] flex-col justify-center items-center bg-white px-[25px] py-[25px]">
        <p className="text-gray-900 text-2xl font-bold mb-5">Login</p>
        <Input
          error={errorsForm.email}
          label="Email"
          type="text"
          onChange={(value) => handleSetData("email", value)}
          value={data.email}
          placeholder="ej: ejemplo@gmail.com"
          width="300px"
          onFocus={() => setErrorsForm((prev) => ({ ...prev, email: "" }))}
          onBlur={() => setErrorsForm((prev) => ({ ...prev, email: "" }))}
        />

        <Input
          error={errorsForm.password}
          label="Password"
          type="password"
          onChange={(value) => handleSetData("password", value)}
          value={data.password}
          width="300px"
          onFocus={() => setErrorsForm((prev) => ({ ...prev, password: "" }))}
          onBlur={() => setErrorsForm((prev) => ({ ...prev, password: "" }))}
        />

        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <input type="checkbox" id="scales" name="scales" />
            <p className="text-black text-sm">Remember me</p>
          </div>
          <button role="button" className="text-black text-sm ">
            forgot your password?
          </button>
        </div>

        <span role="button" className="py-[8px] text-gray-400">
          Don't have an account?
          <span
            role="button"
            onClick={() => navigate("/register")}
            className="ml-2 cursor-pointer text-gray-900 no-underline font-bold outline-none focus:ring-0 focus:outline-none"
          >
            Create one
          </span>
        </span>

        <button
          onClick={login}
          role="button"
          className="bg-black w-full mt-5 rounded-md py-[16px]"
        >
          {loadingApi ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <p className="text-white font-bold">Sign In</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginModule;
