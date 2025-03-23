import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
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
  // Settings2Icon, 
  UploadIcon, 
  VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import athenaLogo from "@/components/images/athena-owl-logo.png";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return "?";
    
    // Split the display name and get initials
    const names = user.displayName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    
    // If only one name, use first two letters or just first letter
    return names[0].substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Main navigation menu items
  const mainNavItems = [
    // {
    //   title: "Dashboard",
    //   path: "/dashboard",
    //   icon: HomeIcon,
    // },
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
              <AvatarImage 
                src={user?.photoURL || ""} 
                alt={user?.displayName || "User"} 
              />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user?.displayName || "Guest User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Not signed in"}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            aria-label="Logout"
          >
          <LogOutIcon size={18} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
