import * as React from "react";
import Input from "../../components/InputField";
import ReactCountryDropdown from "react-country-dropdown";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { ICreateUser } from "../../hooks/types";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: null,
  Available_code: null,
  company_name: ''
};

const RegisterModule = () => {
  const navigate = useNavigate();
  const { handleRegister } = useUser();
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);

  const [data, setData] = React.useState<ICreateUser>(initialState);
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
    let errors: any = {};
    if (!data.email) errors.email = "Please enter a valid email";
    if (!data.firstName) errors.firstName = "Please enter a valid firstName";
    if (!data.lastName) errors.lastName = "Please enter a valid lastName";
    if (!data.password) errors.password = "Please enter a valid passsword";
    if (!data.phone) errors.phone = "Please enter a valid phone";
    if (!data.phone) errors.company_name = "Please enter a valid company name";
    if (!data.phone_country_code)
      errors.phone_country_code = "Please enter a valid phone country code";

    setErrors(errors);
    return errors;
  };

  const register = async () => {
    try {
      setLoadingApi(true);

      const errors = validateErrors();

      if (Object.keys(errors).length === 0) {
        const isCreated = await handleRegister(data);
        if (isCreated) {
          toast.success('Account created successfully!')
        } else {
          console.error("Error creating account");
        }
      }
    } catch (error) {
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
          onChange={(value) => handleSetData("company_name", value)}
          value={data.company_name}
          placeholder="ej: McDonals"
          width="100%"
          error={errors.company_name}
          onFocus={() => setErrors((prev) => ({ ...prev, company_name: "" }))}
          onBlur={() => setErrors((prev) => ({ ...prev, company_name: "" }))}
        />

        <div className="w-full flex flex-col items-start">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Twilio Phone Number
          </label>

          <div className="w-full flex flex-row items-center gap-4">
            <ReactCountryDropdown
              defaultCountry="JP"
              onSelect={(country) =>
                handleSetData(
                  "phone_country_code",
                  parseInt(country.callingCodes[0])
                )
              }
            />
            <Input
              type="number"
              onChange={(value) => handleSetData("phone", parseInt(value))}
              value={data.phone ?? ""}
              placeholder=""
              width="100%"
              onFocus={() =>
                setErrors((prev) => ({
                  ...prev,
                  phone: "",
                  phone_country_code: "",
                }))
              }
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  phone: "",
                  phone_country_code: "",
                }))
              }
            />
          </div>
          {(errors.phone_country_code || errors.phone) && (
            <p className="text-sm text-red-500 ">
              Please enter a valid phone with your country code{" "}
            </p>
          )}
        </div>

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

        <span role="button" className="py-[0px] text-gray-400">
          Don't have a Twilio number yet?
          <span
            role="button"
            onClick={() => navigate("/requestNumber")}
            className="ml-2 cursor-pointer text-gray-900 no-underline font-bold outline-none focus:ring-0 focus:outline-none"
          >
            Request one

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
