
import React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className }: PageWrapperProps) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("min-h-screen w-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageWrapper;
