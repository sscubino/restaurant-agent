import {
  Check,
  HomeIcon,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  MoreVertical,
  Sun,
  Terminal,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { RoutePaths } from "@/config/types";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
          <UserMenu handleLogout={handleLogout} />
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
        <Terminal className="!size-5" />
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

function UserMenu({ handleLogout }: { handleLogout: () => void }) {
  const { data: profile } = useProfile();
  const { isMobile, state } = useSidebar();

  const name = `${profile?.firstName || ""} ${profile?.lastName || ""}`;
  const initials = `${profile?.firstName[0] || ""}${profile?.lastName[0] || ""}`;
  const email = profile?.email || "";

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "grid flex-1 text-left text-sm truncate leading-tight mr-auto",
                state === "collapsed" && "hidden"
              )}
            >
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground text-xs">{email}</span>
            </div>
            <MoreVertical className="size-4 ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="end"
          sideOffset={4}
          side={isMobile ? "bottom" : "right"}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profile?.firstName} {profile?.lastName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {profile?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isMobile ? <MobileThemeSwitcher /> : <DesktopThemeSwitcher />}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} variant="destructive">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function DesktopThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            {<Monitor />}
            System
            {theme === "system" && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon />
            Dark
            {theme === "dark" && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun />
            Light
            {theme === "light" && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

function MobileThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        {<Monitor />}
        System
        {theme === "system" && <Check className="ml-auto size-4" />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon />
        Dark
        {theme === "dark" && <Check className="ml-auto size-4" />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun />
        Light
        {theme === "light" && <Check className="ml-auto size-4" />}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
