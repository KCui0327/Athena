
import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, FilterIcon, SearchIcon, SlidersIcon } from "lucide-react";
import QuizCard from "@/components/ui-custom/QuizCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Quizzes = () => {
  // Sample data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "Organic Chemistry Functional Groups",
      totalQuestions: 20,
      completedQuestions: 5,
      difficulty: "Medium" as const,
      timeEstimate: "15 min",
      subject: "Chemistry"
    },
    {
      id: 2,
      title: "Shakespeare's Major Works",
      totalQuestions: 15,
      completedQuestions: 0,
      difficulty: "Hard" as const,
      timeEstimate: "12 min",
      subject: "Literature"
    },
    {
      id: 3,
      title: "Introduction to Algorithms",
      totalQuestions: 25,
      completedQuestions: 25,
      difficulty: "Hard" as const,
      timeEstimate: "20 min",
      subject: "Computer Science"
    },
    {
      id: 4,
      title: "Linear Algebra Fundamentals",
      totalQuestions: 18,
      completedQuestions: 0,
      difficulty: "Medium" as const,
      timeEstimate: "14 min",
      subject: "Mathematics"
    },
    {
      id: 5,
      title: "World War II: Key Events",
      totalQuestions: 15,
      completedQuestions: 10,
      difficulty: "Easy" as const,
      timeEstimate: "10 min",
      subject: "History"
    },
    {
      id: 6,
      title: "Cell Biology & Cell Division",
      totalQuestions: 22,
      completedQuestions: 0,
      difficulty: "Medium" as const,
      timeEstimate: "18 min",
      subject: "Biology"
    },
    {
      id: 7,
      title: "Thermodynamics Laws",
      totalQuestions: 16,
      completedQuestions: 16,
      difficulty: "Hard" as const,
      timeEstimate: "13 min",
      subject: "Physics"
    },
    {
      id: 8,
      title: "Macroeconomic Policies",
      totalQuestions: 20,
      completedQuestions: 5,
      difficulty: "Medium" as const,
      timeEstimate: "15 min",
      subject: "Economics"
    },
  ];
  
  const allQuizzes = quizzes;
  const inProgressQuizzes = quizzes.filter(quiz => quiz.completedQuestions > 0 && quiz.completedQuestions < quiz.totalQuestions);
  const completedQuizzes = quizzes.filter(quiz => quiz.completedQuestions === quiz.totalQuestions);
  const newQuizzes = quizzes.filter(quiz => quiz.completedQuestions === 0);

  return (
    <AppShell>
      <div className="px-6 py-6 md:px-10 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground mt-1">
              Test your knowledge with AI-generated quizzes
            </p>
          </div>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search quizzes..." 
              className="pl-9"
            />
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <FilterIcon className="h-4 w-4" />
                  Subject
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Subjects</DropdownMenuItem>
                <DropdownMenuItem>Mathematics</DropdownMenuItem>
                <DropdownMenuItem>Physics</DropdownMenuItem>
                <DropdownMenuItem>Chemistry</DropdownMenuItem>
                <DropdownMenuItem>Biology</DropdownMenuItem>
                <DropdownMenuItem>Computer Science</DropdownMenuItem>
                <DropdownMenuItem>History</DropdownMenuItem>
                <DropdownMenuItem>Literature</DropdownMenuItem>
                <DropdownMenuItem>Economics</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <SlidersIcon className="h-4 w-4" />
                  Difficulty
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Difficulties</DropdownMenuItem>
                <DropdownMenuItem>Easy</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>Hard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
        
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {allQuizzes.map((quiz, index) => (
                  <QuizCard
                    key={quiz.id}
                    title={quiz.title}
                    totalQuestions={quiz.totalQuestions}
                    completedQuestions={quiz.completedQuestions}
                    difficulty={quiz.difficulty}
                    timeEstimate={quiz.timeEstimate}
                    index={index}
                    onStart={() => console.log(`Start quiz ${quiz.id}`)}
                    onContinue={() => console.log(`Continue quiz ${quiz.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="in-progress">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {inProgressQuizzes.map((quiz, index) => (
                  <QuizCard
                    key={quiz.id}
                    title={quiz.title}
                    totalQuestions={quiz.totalQuestions}
                    completedQuestions={quiz.completedQuestions}
                    difficulty={quiz.difficulty}
                    timeEstimate={quiz.timeEstimate}
                    index={index}
                    onStart={() => console.log(`Start quiz ${quiz.id}`)}
                    onContinue={() => console.log(`Continue quiz ${quiz.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {completedQuizzes.map((quiz, index) => (
                  <QuizCard
                    key={quiz.id}
                    title={quiz.title}
                    totalQuestions={quiz.totalQuestions}
                    completedQuestions={quiz.completedQuestions}
                    difficulty={quiz.difficulty}
                    timeEstimate={quiz.timeEstimate}
                    index={index}
                    onStart={() => console.log(`Start quiz ${quiz.id}`)}
                    onContinue={() => console.log(`Continue quiz ${quiz.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {newQuizzes.map((quiz, index) => (
                  <QuizCard
                    key={quiz.id}
                    title={quiz.title}
                    totalQuestions={quiz.totalQuestions}
                    completedQuestions={quiz.completedQuestions}
                    difficulty={quiz.difficulty}
                    timeEstimate={quiz.timeEstimate}
                    index={index}
                    onStart={() => console.log(`Start quiz ${quiz.id}`)}
                    onContinue={() => console.log(`Continue quiz ${quiz.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Quizzes;
