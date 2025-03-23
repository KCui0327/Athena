import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface VideoCardProps {
  title: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  index: number;
  onClick: () => void;
  onPlay?: () => void; // Add this prop
  className?: string;
  active?: boolean;
}

const VideoCard = ({ 
  title, 
  thumbnailUrl, 
  duration, 
  views, 
  index,
  onClick,
  onPlay,
  className,
  active = false
}: VideoCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative group cursor-pointer overflow-hidden",
        active ? "opacity-100" : "hover:opacity-95",
        className
      )}
      onClick={onClick}
    >
      <Card className="h-full overflow-hidden border border-border/50 bg-card/90 backdrop-blur-sm hover:bg-card transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative group h-full">
            <div className="aspect-[9/16] overflow-hidden">
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div 
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                active ? "opacity-80" : "opacity-0 group-hover:opacity-70"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.();
              }}
            >
              <div className={cn(
                "w-12 h-12 rounded-full bg-white flex items-center justify-center transition-transform",
                active ? "scale-100" : "scale-75 group-hover:scale-100"
              )}>
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-black">
                  <path d="M8 5.14v14l11-7-11-7z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
              {duration}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
            <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-300 mt-1">{views} views</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
