import { HomeIcon, KeyRound, LayoutDashboard, LogOut } from "lucide-react";
import { StoreIcon, UsersIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RoutePaths } from "@/config/types";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  href: string;
  title: string;
  icon: React.ReactNode;
}

const items: NavigationLinkProps[] = [
  {
    title: "Dashboard",
    href: RoutePaths.HOME,
    icon: <HomeIcon />,
  },
  {
    title: "Invites",
    href: RoutePaths.INVITES,
    icon: <KeyRound />,
  },
  {
    title: "Restaurants",
    href: RoutePaths.RESTAURANTS,
    icon: <StoreIcon />,
  },
  {
    title: "Users",
    href: RoutePaths.USERS,
    icon: <UsersIcon />,
  },
];

interface SidebarProps {
  handleLogout: () => void;
}

export function DashboardSidebar({ handleLogout }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarHeaderButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavigationLink
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="mt-auto">
          <LoggedInUserInfo />
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:text-destructive"
            >
              <LogOut className="size-5" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarHeaderButton() {
  return (
    <SidebarMenuButton
      asChild
      className="data-[slot=sidebar-menu-button]:!p-1.5"
    >
      <Link to={RoutePaths.HOME} className="h-(--header-height) my-1">
        <LayoutDashboard className="!size-5" />
        <span className="text-xl font-semibold">Admin Panel</span>
      </Link>
    </SidebarMenuButton>
  );
}

function NavigationLink({ href, title, icon }: NavigationLinkProps) {
  const location = useLocation();
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <SidebarMenuButton asChild>
      <Link
        to={href}
        className={cn(
          "w-full justify-start",
          isActive(href) && "bg-accent text-accent-foreground"
        )}
      >
        {icon}
        {title}
      </Link>
    </SidebarMenuButton>
  );
}

function LoggedInUserInfo() {
  const { data: profile } = useProfile();
  return (
    <>
      <span className="text-md text-muted-foreground">
        {profile?.firstName} {profile?.lastName}
      </span>
      <span className="text-sm text-muted-foreground/60 mb-2 text-ellipsis overflow-hidden">
        {profile?.email}
      </span>
    </>
  );
}
