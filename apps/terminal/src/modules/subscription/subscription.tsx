import { useEffect, useState } from "react";
import { getCheckoutUrl } from "../../services/api/subscription/subscription";
import useUser from "../../hooks/useUser";
import { FaArrowRight } from "react-icons/fa";

export default function SubscriptionModule() {
  const { user } = useUser();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    console.log(user);
    if (user.id) {
      getCheckoutUrl(user.id)
        .then((url) => {
          console.log(url);
          setCheckoutUrl(url);
        })
        .catch(() => {
          setIsError(true);
        });
    }
  }, [user]);

  console.log(checkoutUrl);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!checkoutUrl && !isError && (
        <h1 className="text-2xl font-bold text-black">Loading...</h1>
      )}
      {checkoutUrl && (
        <a href={checkoutUrl}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
            Go to checkout <FaArrowRight />
          </button>
        </a>
      )}
      {isError && (
        <h1 className="text-2xl font-bold text-black">Something went wrong</h1>
      )}
    </div>
  );
}
