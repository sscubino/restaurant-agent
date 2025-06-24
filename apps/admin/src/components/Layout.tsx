import { useState } from "react";
import { Toaster } from "sonner";

import { SiteHeader } from "@/components/Header";
import { DashboardSidebar } from "@/components/Sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { handleLogout } = useAuth();

  const handleOpenLogoutAlert = () => {
    setIsLogoutOpen(true);
  };

  return (
    <SidebarProvider>
      <DashboardSidebar handleLogout={handleOpenLogoutAlert} />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="@container/main flex flex-1 flex-col gap-2 p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </SidebarProvider>
  );
}
