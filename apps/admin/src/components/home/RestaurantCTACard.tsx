import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoutePaths } from "@/config/types";

export function RestaurantCTACard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Restaurant</CardTitle>
        <CardDescription>
          Add a new restaurant to the system to later send the credentials to
          the restaurant owner.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link to={RoutePaths.RESTAURANTS} state={{ create: true }}>
          <Button className="w-full">Create Restaurant</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
