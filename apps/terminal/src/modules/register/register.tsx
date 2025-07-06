import * as React from "react";
import Input from "../../components/InputField";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { ICreateUser } from "../../hooks/types";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const initialState = (inviteCode: string | null) => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  companyName: "",
  inviteCode: inviteCode ?? "",
});

const RegisterModule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("inviteCode");
  const { handleRegister } = useUser();
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);

  const [data, setData] = React.useState<ICreateUser>(initialState(inviteCode));
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const token = localStorage.getItem("token");

  React.useEffect(() => {
    if (token) {
      navigate("/dashbooard");
    }
  }, []);

  const handleSetData = (key: string, value: string | number) => {
    setData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validateErrors = () => {
    const errors: { [key in keyof ICreateUser]?: string } = {};
    if (!data.email) errors.email = "Please enter a valid email";
    if (!data.firstName) errors.firstName = "Please enter a valid firstName";
    if (!data.lastName) errors.lastName = "Please enter a valid lastName";
    if (!data.password) errors.password = "Please enter a valid passsword";
    if (!data.companyName)
      errors.companyName = "Please enter a valid company name";
    if (!inviteCode) errors.inviteCode = "Please enter a valid invite code";

    setErrors(errors);
    return errors;
  };

  const register = async () => {
    try {
      const errors = validateErrors();

      if (Object.keys(errors).length === 0) {
        const payload = {
          ...data,
          invite_code: inviteCode ?? undefined,
        };
        setLoadingApi(true);
        const isCreated = await handleRegister(payload);
        if (isCreated) {
          toast.success("Account created successfully!");
        } else {
          console.error("Error creating account");
        }
      }
    } catch (error) {
      console.error("Error creating account", error);
    } finally {
      setLoadingApi(false);
    }
  };

  return (
    <div className="w-full h-full items-center justify-center flex">
      <div className="w-[500px] flex flex-col  m-auto bg-white px-[25px] py-[25px] shadow-xl rounded-[5px] items-center  ">
        <p className="text-gray-900 text-2xl font-bold mb-5">Register</p>
        <div className="w-full flex flex-row items-center gap-[8px]">
          <Input
            label="First Name"
            type="text"
            onChange={(value) => handleSetData("firstName", value)}
            value={data.firstName}
            placeholder="ej: Jhon"
            width="50%"
            error={errors.firstName}
            onFocus={() => setErrors((prev) => ({ ...prev, firstName: "" }))}
            onBlur={() => setErrors((prev) => ({ ...prev, firstName: "" }))}
          />
          <Input
            label="Last Name"
            type="text"
            onChange={(value) => handleSetData("lastName", value)}
            value={data.lastName}
            placeholder="ej: Doe"
            width="50%"
            error={errors.lastName}
            onFocus={() => setErrors((prev) => ({ ...prev, lastName: "" }))}
            onBlur={() => setErrors((prev) => ({ ...prev, lastName: "" }))}
          />
        </div>
        <Input
          label="Email"
          type="email"
          onChange={(value) => handleSetData("email", value)}
          value={data.email}
          placeholder="ej: example@gmail.com"
          width="100%"
          error={errors.email}
          onFocus={() => setErrors((prev) => ({ ...prev, email: "" }))}
          onBlur={() => setErrors((prev) => ({ ...prev, email: "" }))}
        />

        <Input
          label="Password"
          type="password"
          onChange={(value) => handleSetData("password", value)}
          value={data.password}
          placeholder="ej: 123"
          width="100%"
          error={errors.password}
          onFocus={() => setErrors((prev) => ({ ...prev, password: "" }))}
          onBlur={() => setErrors((prev) => ({ ...prev, password: "" }))}
        />

        <Input
          label="Company Name"
          type="text"
          onChange={(value) => handleSetData("companyName", value)}
          value={data.companyName}
          placeholder="ej: McDonals"
          width="100%"
          error={errors.companyName}
          onFocus={() => setErrors((prev) => ({ ...prev, companyName: "" }))}
          onBlur={() => setErrors((prev) => ({ ...prev, companyName: "" }))}
        />

        {!inviteCode && (
          <Input
            label="Invite Code"
            type="text"
            onChange={(value) => handleSetData("inviteCode", value)}
            value={data.inviteCode ?? ""}
            placeholder="ej: ABC123"
            width="100%"
            error={errors.inviteCode}
            onFocus={() => setErrors((prev) => ({ ...prev, inviteCode: "" }))}
            onBlur={() => setErrors((prev) => ({ ...prev, inviteCode: "" }))}
          />
        )}

        <span role="button" className="py-[8px] text-gray-400">
          Already have an account?
          <span
            role="button"
            onClick={() => navigate("/login")}
            className="ml-2 cursor-pointer text-gray-900 no-underline font-bold outline-none focus:ring-0 focus:outline-none"
          >
            Sign in
          </span>
        </span>

        <button
          onClick={register}
          role="button"
          className="bg-black cursor-pointer w-full mt-5 rounded-md py-[16px]"
        >
          {loadingApi ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <p className="text-white font-bold">Sign Up</p>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterModule;
