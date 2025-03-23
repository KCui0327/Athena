
import React from "react";
import { cn } from "@/lib/utils";
import { BrainIcon, StarIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface QuizCardProps {
  title: string;
  totalQuestions: number;
  completedQuestions?: number;
  difficulty: "Easy" | "Medium" | "Hard";
  className?: string;
  onStart?: () => void;
  onContinue?: () => void;
  index?: number;
}

const QuizCard = ({ 
  title, 
  totalQuestions, 
  completedQuestions = 0, 
  difficulty, 
  className,
  onStart,
  onContinue,
  index = 0
}: QuizCardProps) => {
  const isStarted = completedQuestions > 0;
  const isCompleted = completedQuestions === totalQuestions;
  
  const difficultyColor = {
    "Easy": "bg-green-100 text-green-800",
    "Medium": "bg-amber-100 text-amber-800",
    "Hard": "bg-red-100 text-red-800",
  }[difficulty];

  const renderDifficultyStars = () => {
    const stars = {
      "Easy": 1,
      "Medium": 2,
      "Hard": 3,
    }[difficulty];
    
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          size={16}
          className={i < stars ? "text-primary" : "text-muted"}
          fill={i < stars ? "currentColor" : "none"}
        />
      ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className={cn("h-full", className)}
    >
      <Card className="h-full overflow-hidden border-border/50 bg-card/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={cn("font-normal", difficultyColor)}>
              {difficulty}
            </Badge>
            <div className="flex items-center gap-0.5">
              {renderDifficultyStars()}
            </div>
          </div>
          <CardTitle className="text-xl line-clamp-2 min-h-[3.75rem]">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {completedQuestions} of {totalQuestions} questions
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={isStarted ? onContinue : onStart}
          >
            <BrainIcon className="w-4 h-4 mr-2" />
            {isCompleted ? "Review" : isStarted ? "Continue" : "Start Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizCard;
