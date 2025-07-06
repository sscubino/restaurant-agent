import ProtectedLayout from "../components/ProtectedLayout";
import SubscriptionSuccessModule from "../modules/subscriptionSuccess/subscriptionSuccess";

const SubscriptionSuccess = () => {
  return (
    <ProtectedLayout>
      <SubscriptionSuccessModule />
    </ProtectedLayout>
  );
};

export default SubscriptionSuccess;
