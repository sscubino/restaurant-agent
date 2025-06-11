import useUser from "../hooks/useUser";
import { ClipLoader } from "react-spinners";
import OtpInput from "react-otp-input";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const PhoneValidateContent = () => {
  const { user, loading, handleVerifyCode, sendVerifyCode, getItemByToken } =
    useUser();
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  useEffect(() => {
    if (isResendDisabled) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isResendDisabled]);

  const handleVerfiyCode = async () => {
    if (!otp) {
      //toasst error
    } else {
      const isValid = await handleVerifyCode(otp);
      if (isValid) {
        await getItemByToken(localStorage.getItem("token") ?? "");
        toast.success("Code validated successfully!");
      } else {
        toast.error("Invalid phone code number!");

        console.log("no es valido");
      }
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    const sended = await sendVerifyCode();
    if (sended) {
      toast.success("Verification code sended successfully!");
    } else {
      toast.error("Error sending verification code!");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
      <div className="w-[400px] flex flex-col bg-white px-6 py-8 shadow-lg rounded-xl items-center">
        <h2 className="text-gray-900 text-2xl font-semibold mb-3">
          Hi <b>{user?.firstName}</b>! <br />
          Verify your Phone Number
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter the 6-digit code sent to your phone
        </p>

        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="tel"
          shouldAutoFocus
          renderSeparator={() => <div className="mx-1" />}
          renderInput={(props) => (
            <input
              {...props}
              className="!w-[40px] !h-[48px] text-center text-lg font-semibold text-gray-800 border-2 border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 outline-none"
            />
          )}
        />

        <p className="text-gray-500 text-sm mt-4">
          Didn't receive the code?{" "}
          <span
            role="button"
            onClick={isResendDisabled ? () => null : handleResendCode}
            className={`ml-1 cursor-pointer font-bold ${
              isResendDisabled ? "text-gray-400" : "text-black"
            }`}
          >
            {isResendDisabled ? `Resend in ${resendTimer}s` : "Send again"}
          </span>
        </p>

        <button
          onClick={handleVerfiyCode}
          className="bg-black w-full mt-5 rounded-lg py-3 text-white font-bold hover:bg-gray-900 transition-all duration-200"
          disabled={otp.length !== 6}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Verify Code"}
        </button>
      </div>
    </div>
  );
};

export default PhoneValidateContent;
