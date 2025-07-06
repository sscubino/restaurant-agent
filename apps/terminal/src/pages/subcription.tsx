import ProtectedLayout from "../components/ProtectedLayout";
import SubscriptionModule from "../modules/subscription/subscription";

const Subscription = () => {
  console.log("Subscription");
  return (
    <ProtectedLayout>
      <SubscriptionModule />
    </ProtectedLayout>
  );
};

export default Subscription;
