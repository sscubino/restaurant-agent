import { Link } from "react-router-dom";

export default function SubscriptionSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-black">Subscription Success!</h1>
      <p className="text-gray-500">
        Your subscription has been successfully activated.
      </p>
      <Link to="/dashbooard">Go to dashboard</Link>
    </div>
  );
}
