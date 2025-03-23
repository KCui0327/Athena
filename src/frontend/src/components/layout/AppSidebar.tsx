
import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  BrainIcon, 
  FileTextIcon, 
  HelpCircleIcon, 
  HomeIcon, 
  LogOutIcon,
  Settings2Icon, 
  UploadIcon, 
  VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import athenaLogo from "@/components/images/athena-owl-logo.png";

export function AppSidebar() {
  const location = useLocation();

  // Main navigation menu items
  const mainNavItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "My Notes",
      path: "/notes",
      icon: FileTextIcon,
    },
    {
      title: "Quizzes",
      path: "/quizzes",
      icon: BrainIcon,
    },
    {
      title: "Video Snippets",
      path: "/videos",
      icon: VideoIcon,
    },
  ];

  // Additional actions menu items
  const actionsNavItems = [
    {
      title: "Upload Notes",
      path: "/notes/upload",
      icon: UploadIcon,
    },
    {
      title: "Account Settings",
      path: "/settings",
      icon: Settings2Icon,
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex flex-col items-center justify-center px-6 py-6">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-75 blur"></div>
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white">
              <img 
                src={athenaLogo}
                alt="Athena Logo" 
                className="h-8 w-8" 
              />
            </div>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Athena</h1>
        </div>
        <div className="absolute right-4 top-3 md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2",
                        location.pathname === item.path && "text-primary"
                      )}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionsNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2",
                        location.pathname === item.path && "text-primary"
                      )}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/images/avatar.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/logout" aria-label="Logout">
              <LogOutIcon size={18} />
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
