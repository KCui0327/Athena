
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MenuIcon, 
  BrainIcon, 
  VideoIcon, 
  XIcon 
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import athenaLogo from "@/components/images/athena-owl-logo.png";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for transparent to solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Students", href: "#for-students" },
    { name: "Pricing", href: "#pricing" },
  ];

  // Navigation items
  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-foreground/80 hover:text-foreground transition-colors duration-200"
        >
          {link.name}
        </a>
      ))}
    </>
  );

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
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
          <span className="text-xl font-semibold tracking-tight">Athena</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavItems />
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <MenuIcon size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
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
                      <span className="text-xl font-semibold tracking-tight">Athena</span>
                    </Link>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto py-6 px-6">
                  <nav className="flex flex-col space-y-6">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-lg"
                      >
                        {link.name}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="p-6 border-t">
                  <div className="flex flex-col space-y-3">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
