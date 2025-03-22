
import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import VideoCard from "@/components/ui-custom/VideoCard";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const VideoSnippets = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Sample data for videos
  const videos = [
    {
      id: 1,
      title: "Understanding Quantum Superposition",
      thumbnailUrl: "https://images.unsplash.com/photo-1581092921461-fd0e43297f8a?q=80&w=640",
      duration: "2:45",
      views: "342",
      subject: "Physics"
    },
    {
      id: 2,
      title: "How Neural Networks Learn Patterns",
      thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=640",
      duration: "3:20",
      views: "287",
      subject: "Computer Science"
    },
    {
      id: 3,
      title: "Cellular Respiration Explained",
      thumbnailUrl: "https://images.unsplash.com/photo-1607448885122-b3fa32420561?q=80&w=640",
      duration: "4:15",
      views: "198",
      subject: "Biology"
    },
    {
      id: 4,
      title: "The Causes of the Great Depression",
      thumbnailUrl: "https://images.unsplash.com/photo-1575502326837-0718fbf99503?q=80&w=640",
      duration: "3:05",
      views: "176",
      subject: "History"
    },
    {
      id: 5,
      title: "Solving Integration by Parts",
      thumbnailUrl: "https://images.unsplash.com/photo-1621681524525-a8e20633a010?q=80&w=640",
      duration: "2:50",
      views: "215",
      subject: "Mathematics"
    },
    {
      id: 6,
      title: "Acid-Base Reactions Simplified",
      thumbnailUrl: "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?q=80&w=640",
      duration: "2:30",
      views: "165",
      subject: "Chemistry"
    },
    {
      id: 7,
      title: "Literary Devices in Shakespeare",
      thumbnailUrl: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=640",
      duration: "3:40",
      views: "122",
      subject: "Literature"
    },
    {
      id: 8,
      title: "Supply and Demand Equilibrium",
      thumbnailUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=640",
      duration: "2:55",
      views: "189",
      subject: "Economics"
    },
  ];

  // Get all unique subjects for tabs
  const subjects = ["all", ...Array.from(new Set(videos.map(video => video.subject)))];

  // Filter videos based on selected subject
  const filteredVideos = selectedSubject === "all" 
    ? videos 
    : videos.filter(video => video.subject === selectedSubject);

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 border-b"
        >
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Video Snippets</h1>
            <p className="text-muted-foreground mt-1">
              Watch AI-generated video explanations of your notes
            </p>
          </div>
          
          {/* Subject Tabs */}
          <Tabs 
            defaultValue="all" 
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            className="w-full"
          >
            <TabsList className="w-full h-auto flex gap-1 overflow-x-auto pb-2 justify-start bg-transparent">
              {subjects.map((subject) => (
                <TabsTrigger
                  key={subject}
                  value={subject}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap",
                    selectedSubject === subject 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>
        
        {/* Search (optional) */}
        <div className="px-4 sm:px-6 py-2 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search videos..." 
              className="pl-9"
            />
          </div>
        </div>
        
        {/* Videos Feed - Vertical scrolling container */}
        <div className="flex-1 overflow-y-auto py-4 px-0 sm:px-2">
          <div className="max-w-sm mx-auto space-y-4">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="shadow-md rounded-lg overflow-hidden"
              >
                <VideoCard
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  duration={video.duration}
                  views={video.views}
                  index={index}
                  onClick={() => console.log(`Play video ${video.id}`)}
                  className="aspect-[9/16] h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default VideoSnippets;
