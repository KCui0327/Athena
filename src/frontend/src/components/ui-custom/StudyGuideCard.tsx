
import React from "react";
import { cn } from "@/lib/utils";
import { BookOpenIcon, MoreVerticalIcon, PenIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface StudyGuideCardProps {
  title: string;
  preview: string;
  date: string;
  pages: number;
  subject?: string;
  className?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  index?: number;
}

const StudyGuideCard = ({ 
  title, 
  preview, 
  date, 
  pages,
  subject,
  className,
  onView,
  onEdit,
  onDelete,
  index = 0
}: StudyGuideCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={cn("h-full", className)}
    >
      <Card className="h-full overflow-hidden border-border/50 bg-card/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            {subject && (
              <Badge variant="outline" className="mb-2">
                {subject}
              </Badge>
            )}
            <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVerticalIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <BookOpenIcon size={16} className="mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <PenIcon size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 min-h-[4.5rem]">
            {preview}
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between border-t pt-3 mt-2">
          <div>{date}</div>
          <div>{pages} pages</div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default StudyGuideCard;
