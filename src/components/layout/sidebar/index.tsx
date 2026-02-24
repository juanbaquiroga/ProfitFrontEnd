"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ChevronLeft, ChevronRight, Menu, LogOut } from "lucide-react";
import { DASHBOARD_ROUTES, SETTINGS_ROUTE } from "./navigation";
import { SidebarItem } from "@/components/layout/sidebar/SidebarItem";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";

export const Sidebar = () => {
  const sidebarRef = useRef(null);
  const router = useRouter();
  const { isSidebarCollapsed, toggleSidebar, animationsEnabled, logout } = useAppStore();

  useGSAP(() => {
    if (!animationsEnabled) return;

    gsap.to(sidebarRef.current, {
      width: isSidebarCollapsed ? 80 : 256, // 80px vs 256px (w-20 vs w-64)
      duration: 0.4,
      ease: "expo.out",
    });
  }, [isSidebarCollapsed]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      ref={sidebarRef}
      className="relative hidden h-screen flex-col border-r bg-card shadow-sm md:flex overflow-hidden z-10 shrink-0 w-auto"
    >
      <div className={cn(
        "flex h-16 shrink-0 items-center px-4",
        isSidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isSidebarCollapsed && <span className="font-bold text-lg">Profit</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-profit/10"
        >
          {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      <div className="px-4 ">
        <Separator />
      </div>


      <div className="flex flex-1 flex-col gap-y-2 p-2">
        {DASHBOARD_ROUTES.map((route) => (
          <SidebarItem key={route.href} {...route} />
        ))}
      </div>
      <div className="mt-auto p-4 flex flex-col gap-2">
        <Separator className="mb-4" />
        <nav className="grid gap-1">
          {/* Enlace de configuración */}
          <SidebarItem
            icon={SETTINGS_ROUTE.icon}
            label={SETTINGS_ROUTE.label}
            href={SETTINGS_ROUTE.href}
          />

          {/* Botón de Logout */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
              isSidebarCollapsed && "justify-center px-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("shrink-0", isSidebarCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4")} />
            {!isSidebarCollapsed && "Cerrar sesión"}
          </Button>

          {/* Aquí podrías añadir un componente para el perfil del usuario */}
          {/* <UserProfile /> */}
        </nav>
      </div>
    </aside>
  );
};