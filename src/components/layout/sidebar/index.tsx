"use client";

import { useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ChevronLeft, Menu } from "lucide-react";
import { DASHBOARD_ROUTES, SETTINGS_ROUTE } from "./navigation";
import { SidebarItem } from "@/components/layout/sidebar/SidebarItem";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Sidebar = () => {
  const sidebarRef = useRef(null);
  const { isSidebarCollapsed, toggleSidebar, animationsEnabled, user } = useAppStore();

  useGSAP(() => {
    if (!animationsEnabled) return;

    gsap.to(sidebarRef.current, {
      width: isSidebarCollapsed ? 80 : 256,
      duration: 0.4,
      ease: "expo.out",
    });
  }, [isSidebarCollapsed]);

  const getInitials = (name?: string, lastName?: string) => {
    if (!name && !lastName) return "U";
    return `${name?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
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
          className="hover:bg-profit/20"
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
          {user && (
            <div
              className={cn(
                "flex items-center gap-3 mb-2 p-2 rounded-md transition-colors",
                isSidebarCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white font-semibold text-sm shadow-sm"
                style={{ backgroundColor: user.colorAvatar || "#10b981" }}
              >
                {getInitials(user.name, user.lastName)}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium">
                    {user.name} {user.lastName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </div>
              )}
            </div>
          )}

          <SidebarItem
            icon={SETTINGS_ROUTE.icon}
            label={SETTINGS_ROUTE.label}
            href={SETTINGS_ROUTE.href}
          />
        </nav>
      </div>
    </aside>
  );
};