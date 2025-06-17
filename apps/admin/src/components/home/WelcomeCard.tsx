import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the dashboard</CardTitle>
        <CardDescription>
          This is the dashboard for the admin panel. You can manage users,
          settings, and more here.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
