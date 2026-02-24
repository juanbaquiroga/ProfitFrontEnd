"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useAppStore();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-lg transition-all duration-200 group relative",
        isSidebarCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-x-3 px-3 py-2.5",
        isActive ? "bg-profit/10 text-profit" : "text-muted-foreground hover:bg-profit/10"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-profit" : "group-hover:text-foreground")} />
      
      {!isSidebarCollapsed && (
        <span className="truncate opacity-100 transition-opacity duration-300">
          {label}
        </span>
      )}

      {isActive && !isSidebarCollapsed && (
        <div className="absolute right-0 h-full w-1 rounded-l-full bg-profit" />
      )}
    </Link>
  );

  if (isSidebarCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {label}
          </TooltipContent> 
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};
