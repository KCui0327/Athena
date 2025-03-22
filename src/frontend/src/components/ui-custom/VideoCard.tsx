
import React from "react";
import { cn } from "@/lib/utils";
import { PlayCircleIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface VideoCardProps {
  title: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  className?: string;
  onClick?: () => void;
  index?: number;
}

const VideoCard = ({ 
  title, 
  thumbnailUrl, 
  duration,
  views,
  className,
  onClick,
  index = 0
}: VideoCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("h-full", className)}
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-16 w-16 rounded-full text-white" 
                onClick={onClick}
              >
                <PlayCircleIcon size={48} />
              </Button>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
              {duration}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium line-clamp-2">{title}</h3>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-0 pb-4 px-4">
          {views} views
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
