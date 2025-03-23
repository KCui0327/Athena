import React, { useState, useEffect, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import VideoCard from "@/components/ui-custom/VideoCard";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const VideoSnippets = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter videos based on selected subject and search query
  const filteredVideos = videos
    .filter(video => selectedSubject === "all" || video.subject === selectedSubject)
    .filter(video => video.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Initialize refs array for each video
  useEffect(() => {
    videoRefs.current = Array(filteredVideos.length).fill(null);
  }, [filteredVideos.length]);

  // Improved scroll to video function with debounce
  const scrollToVideo = useCallback((index: number) => {
    if (index < 0 || index >= videoRefs.current.length || !containerRef.current) {
      return;
    }
    
    const targetElement = videoRefs.current[index];
    
    if (!targetElement) {
      console.warn(`Video element at index ${index} not found`);
      return;
    }
    
    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = targetElement.getBoundingClientRect();
    
    // Calculate the scroll position to center the element
    const offset = elementRect.top - containerRect.top - 
      (containerRect.height / 2 - elementRect.height / 2) + 
      containerRef.current.scrollTop;
    
    // Scroll with smooth behavior
    containerRef.current.scrollTo({
      top: offset,
      behavior: "smooth"
    });
    
    // Add visual indicator
    targetElement.classList.add("focus-ring");
    setTimeout(() => {
      targetElement.classList.remove("focus-ring");
    }, 800);
    
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys
      if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === 'ArrowDown') {
        setActiveIndex(prev => {
          const newIndex = Math.min(prev + 1, filteredVideos.length - 1);
          if (newIndex !== prev) {
            console.log(`Selected video ${filteredVideos[newIndex].id}`);
            // Important: Use setTimeout to ensure the DOM has updated
            setTimeout(() => scrollToVideo(newIndex), 0);
          }
          return newIndex;
        });
      } else if (e.key === 'ArrowUp') {
        setActiveIndex(prev => {
          const newIndex = Math.max(prev - 1, 0);
          if (newIndex !== prev) {
            console.log(`Selected video ${filteredVideos[newIndex].id}`);
            // Important: Use setTimeout to ensure the DOM has updated
            setTimeout(() => scrollToVideo(newIndex), 0);
          }
          return newIndex;
        });
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        // Handle video playback with Enter key
        console.log(`Play video ${filteredVideos[activeIndex].id}`);
        
        // Call the video playing logic here
        // For example: playVideo(filteredVideos[activeIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredVideos, activeIndex, scrollToVideo]);

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Header with search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 sm:p-6 border-b"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Video Snippets</h1>
              <p className="text-muted-foreground mt-1">
                Watch AI-generated video explanations of your notes
              </p>
            </div>
            
            
          </div>
          
        </motion.div>
        
        {/* Videos Feed - Vertical scrolling container */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto py-4 px-0 sm:px-2 scroll-smooth"
        >
          <div className="max-w-sm mx-auto space-y-6">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                ref={el => videoRefs.current[index] = el}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: activeIndex === index ? 1.02 : 1,
                  transition: { 
                    duration: 0.3, 
                    delay: index * 0.05,
                    scale: { duration: 0.15 }
                  }
                }}
                className={cn(
                  "shadow-md rounded-lg overflow-hidden transition-all duration-200",
                  activeIndex === index 
                    ? "ring-2 ring-primary ring-offset-2 shadow-lg" 
                    : "hover:ring-1 hover:ring-primary/50"
                )}
                onClick={() => {
                  setActiveIndex(index);
                  console.log(`Selected video ${video.id}`);
                  // Add any additional selection actions here
                }}
                onDoubleClick={() => {
                  console.log(`Play video ${video.id}`);
                  // Add your video playing logic here
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <VideoCard
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  duration={video.duration}
                  views={video.views}
                  index={index}
                  active={activeIndex === index}
                  onClick={() => {
                    // Single click handler for card
                    console.log(`Selected video ${video.id}`);
                  }}
                  onPlay={() => {
                    // Play button handler for card
                    console.log(`Play video ${video.id}`);
                    // Add your video playing logic here
                  }}
                  className="aspect-[9/16] h-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Keyboard navigation hint */}
        <div className="py-2 px-4 bg-muted/50 text-center text-sm text-muted-foreground">
          <p>Use <kbd className="px-1 py-0.5 bg-background rounded border">↑</kbd> and <kbd className="px-1 py-0.5 bg-background rounded border">↓</kbd> arrow keys to navigate videos. Press <kbd className="px-1 py-0.5 bg-background rounded border">Enter</kbd> to play.</p>
        </div>
      </div>
    </AppShell>
  );
};

export default VideoSnippets;
