
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const Section = ({ id, children, className }: SectionProps) => {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24", className)}
    >
      <div className="container px-4 md:px-6">
        {children}
      </div>
    </section>
  );
};

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionTitle({ 
  title, 
  subtitle, 
  align = "center", 
  className 
}: SectionTitleProps) {
  return (
    <motion.div 
      className={cn(
        "max-w-3xl mx-auto mb-12",
        align === "left" && "ml-0 text-left",
        align === "center" && "text-center",
        align === "right" && "mr-0 text-right",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-muted-foreground">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default Section;
