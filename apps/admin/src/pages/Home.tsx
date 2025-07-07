import { InviteCTACard } from "@/components/home/InviteCTACard";
import { RestaurantCTACard } from "@/components/home/RestaurantCTACard";
import { WelcomeCard } from "@/components/home/WelcomeCard";

function Home() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InviteCTACard />
        <RestaurantCTACard />
      </div>
    </div>
  );
}

export default Home;
