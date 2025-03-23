
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  RefreshCwIcon,
  HomeIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: number;
  quizTitle: string;
}

const QuizModal = ({ isOpen, onClose, quizId, quizTitle }: QuizModalProps) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Mock quiz data - in a real app, this would be fetched from an API
  const questions: Question[] = [
    {
      id: 1,
      text: "Which principle states that the position and momentum of a particle cannot be simultaneously measured with arbitrary precision?",
      options: [
        "Pauli exclusion principle",
        "Heisenberg uncertainty principle",
        "Superposition principle",
        "Correspondence principle"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "What does the wave function collapse represent in quantum mechanics?",
      options: [
        "The transition from quantum to classical behavior",
        "The measurement of a quantum system",
        "The interference of probability waves",
        "The entanglement of quantum particles"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "Which experiment demonstrated the wave-particle duality of matter?",
      options: [
        "Millikan oil drop experiment",
        "Michelson-Morley experiment",
        "Double-slit experiment",
        "Stern-Gerlach experiment"
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "What is the mathematical representation of a quantum state?",
      options: [
        "A differential equation",
        "A probability distribution",
        "A wave function",
        "A matrix"
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      text: "What does quantum entanglement describe?",
      options: [
        "The collapse of wave functions",
        "Correlation between quantum particles regardless of distance",
        "The uncertainty in position and momentum",
        "The dual nature of particles"
      ],
      correctAnswer: 1
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const renderOption = (option: string, index: number) => {
    const isSelected = selectedAnswers[currentQuestionIndex] === index;
    return (
      <Button
        key={index}
        variant="outline"
        className={cn(
          "justify-start h-auto py-3 px-4 mb-3 w-full text-left font-normal",
          isSelected && "border-primary"
        )}
        onClick={() => handleOptionSelect(index)}
      >
        <div className={cn(
          "mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
        )}>
          {isSelected && <CheckIcon className="h-3 w-3" />}
        </div>
        <span>{option}</span>
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{quizTitle}</DialogTitle>
        </DialogHeader>
        
        {!showResults ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium">
                  {selectedAnswers.filter(answer => answer !== undefined).length} answered
                </span>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="font-medium mb-4">{currentQuestion.text}</p>
                  <div className="space-y-1">
                    {currentQuestion.options.map((option, index) => renderOption(option, index))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                  {currentQuestionIndex !== questions.length - 1 && (
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center py-4">
              <p className="text-2xl font-bold mb-2">Quiz Complete!</p>
              <p className="text-xl mb-4">
                Your score: {calculateScore()} / {questions.length}
              </p>
              <div className="flex justify-center gap-2 my-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-2 w-2 rounded-full",
                      i < Math.round(calculateScore() / questions.length * 5) 
                        ? "bg-primary" 
                        : "bg-muted"
                    )} 
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                {calculateScore() === questions.length 
                  ? "Perfect! You got all questions correct."
                  : calculateScore() > questions.length / 2 
                    ? "Good job! You're on the right track."
                    : "Keep studying. You'll do better next time."}
              </p>
            </div>
            
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={resetQuiz}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Retry Quiz
              </Button>
              <Button onClick={() => {
                onClose();
                navigate("/quizzes");
              }}>
                <HomeIcon className="mr-2 h-4 w-4" />
                Return to Quizzes
              </Button>
            </DialogFooter>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
