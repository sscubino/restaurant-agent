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

export function InviteCTACard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Invite</CardTitle>
        <CardDescription>
          Generate a new invite code to allow restaurant owners to register
          themselves by using the generated link.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Link to={RoutePaths.INVITES} state={{ create: true }}>
          <Button className="w-full">Create Invite Code</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
