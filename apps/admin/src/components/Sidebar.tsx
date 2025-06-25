import { HomeIcon, LayoutDashboard, LogOut } from "lucide-react";
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
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    href: RoutePaths.HOME,
    icon: <HomeIcon />,
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
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={RoutePaths.HOME} className="h-(--header-height) my-1">
                <LayoutDashboard className="!size-5" />
                <span className="text-xl font-semibold">Admin Panel</span>
              </Link>
            </SidebarMenuButton>
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
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "w-full justify-start",
                        isActive(item.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="mt-auto">
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
