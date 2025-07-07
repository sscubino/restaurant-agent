import { Link } from "react-router-dom";

const SuccessVerify = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Account Created Successfully!
        </h2>
        <p className="text-gray-600 mt-2 mb-4">
          Your account has been created and verified successfully. You can now
          log in and start using our services.
        </p>
        <Link to="/">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default SuccessVerify;
