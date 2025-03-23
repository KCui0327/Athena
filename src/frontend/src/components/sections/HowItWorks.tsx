
import React from "react";
import { cn } from "@/lib/utils";
import Section, { SectionTitle } from "@/components/ui-custom/Section";
import { ArrowRightIcon, BookIcon, BrainIcon, FileTextIcon, VideoIcon } from "lucide-react";
import { motion } from "framer-motion";

interface HowItWorksProps {
  className?: string;
}

const HowItWorks = ({ className }: HowItWorksProps) => {
  const steps = [
    {
      title: "Upload your notes",
      description: "Upload text, images, or links to videos from your classes and lectures.",
      icon: <FileTextIcon className="h-8 w-8" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "AI processes your content",
      description: "Our AI analyzes your notes to identify key concepts, relationships, and knowledge gaps.",
      icon: <ArrowRightIcon className="h-8 w-8" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Create study guides",
      description: "Get comprehensive study guides organized by topic and importance.",
      icon: <BookIcon className="h-8 w-8" />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Test your knowledge",
      description: "Take personalized quizzes designed to reinforce your learning and fill knowledge gaps.",
      icon: <BrainIcon className="h-8 w-8" />,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Watch video explanations",
      description: "Access bite-sized video snippets that explain complex topics from your notes.",
      icon: <VideoIcon className="h-8 w-8" />,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <Section id="how-it-works" className={cn("bg-secondary", className)}>
      <SectionTitle 
        title="How Athena Works"
        subtitle="Turn your notes into knowledge in just a few simple steps"
      />
      
      <div className="mt-16 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start mb-12 last:mb-0"
          >
            <div className={cn(
              "flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full mr-6",
              step.color
            )}>
              {step.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default HowItWorks;
