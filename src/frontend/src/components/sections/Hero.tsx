
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import athenaLogo from "@/components/images/athena-owl-logo.png";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden flex items-center justify-center min-h-screen",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent to-background" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute top-[25%] right-[15%] h-56 w-56 rounded-full bg-secondary blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute top-[40%] left-[20%] h-64 w-64 rounded-full bg-primary blur-[120px]"
        />
      </div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[800px] text-center">
          <motion.div className="mb-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-secondary to-primary opacity-75 blur"></div>
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-white">
                  <img 
                    src={athenaLogo}
                    alt="Athena Logo" 
                    className="h-16 w-16" 
                  />
                </div>
              </div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
            >
              Welcome to <span className="text-primary">Athena</span>
            </motion.h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="mt-6 text-xl text-muted-foreground md:text-2xl mb-12">
              Your personal AI study assistant
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-base bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/register">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base border-secondary text-secondary hover:bg-secondary/10">
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
