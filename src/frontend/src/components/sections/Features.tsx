
import React from "react";
import { cn } from "@/lib/utils";
import Section, { SectionTitle } from "@/components/ui-custom/Section";
import FeatureCard from "@/components/ui-custom/FeatureCard";
import { 
  BookIcon, 
  BrainIcon, 
  FileTextIcon, 
  FlaskConicalIcon, 
  SparklesIcon, 
  UploadIcon, 
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface FeaturesProps {
  className?: string;
}

const Features = ({ className }: FeaturesProps) => {
  const features = [
    {
      title: "Upload Your Notes",
      description: "Upload text, images, and links to videos with easy tagging for organization.",
      icon: <UploadIcon className="h-6 w-6" />,
    },
    {
      title: "Smart Summaries",
      description: "Instantly create concise summaries of your notes, highlighting key concepts.",
      icon: <SparklesIcon className="h-6 w-6" />,
    },
    {
      title: "Study Guides",
      description: "Generate comprehensive study guides organized by topic and importance.",
      icon: <BookIcon className="h-6 w-6" />,
    },
    {
      title: "Custom Quizzes",
      description: "Create quizzes tailored to your learning style and knowledge gaps.",
      icon: <BrainIcon className="h-6 w-6" />,
    },
    {
      title: "Video Explanations",
      description: "Get TikTok-style video snippets explaining complex topics from your notes.",
      icon: <VideoIcon className="h-6 w-6" />,
    },
    {
      title: "Progress Tracking",
      description: "Track your learning progress and identify areas for improvement.",
      icon: <ZapIcon className="h-6 w-6" />,
    },
  ];

  return (
    <Section id="features" className={cn("bg-background relative z-10", className)}>
      <SectionTitle 
        title="Features to Supercharge Your Learning"
        subtitle="Everything you need to turn your notes into knowledge you'll remember"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            delay={index}
          />
        ))}
      </div>
    </Section>
  );
};

export default Features;
