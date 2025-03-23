
import React from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageWrapper from "./PageWrapper";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <ScrollArea className="h-screen w-full bg-background">
          <PageWrapper className={cn("p-0", className)}>
            {children}
          </PageWrapper>
        </ScrollArea>
      </div>
    </SidebarProvider>
  );
}
