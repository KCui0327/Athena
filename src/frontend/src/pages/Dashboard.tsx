import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon, FileTextIcon, PlusIcon, UploadIcon, VideoIcon } from "lucide-react";
import { Link } from "react-router-dom";
import NoteCard from "@/components/ui-custom/NoteCard";
import QuizCard from "@/components/ui-custom/QuizCard";
import { motion } from "framer-motion";

const Dashboard = () => {
  const recentNotes = [
    {
      id: 1,
      title: "Quantum Mechanics Introduction",
      preview: "The fundamental principles of quantum mechanics, including wave-particle duality, superposition, and measurement theory.",
      date: "2 hours ago",
      tags: ["Physics", "Quantum"]
    },
    {
      id: 2,
      title: "Macroeconomic Policy Effects",
      preview: "Analysis of how fiscal and monetary policies affect inflation, employment, and economic growth in different scenarios.",
      date: "Yesterday",
      tags: ["Economics", "Macroeconomics"]
    },
    {
      id: 3,
      title: "Neural Network Architectures",
      preview: "Overview of various neural network structures including CNNs, RNNs, and Transformers with their specific applications.",
      date: "2 days ago",
      tags: ["AI", "Machine Learning"]
    }
  ];

  const quizzes = [
    {
      id: 1,
      title: "Organic Chemistry Functional Groups",
      totalQuestions: 20,
      completedQuestions: 5,
      difficulty: "Medium" as const
    },
    {
      id: 2,
      title: "Shakespeare's Major Works",
      totalQuestions: 15,
      completedQuestions: 0,
      difficulty: "Hard" as const
    }
  ];

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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your study progress.
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild>
              <Link to="/notes/upload">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Notes
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards (no Study Guides) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8"
        >
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center">
              <div className="bg-primary/10 p-2 rounded-md mr-3">
                <FileTextIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                <CardDescription>Count of all notes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+7 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center">
              <div className="bg-amber-100 p-2 rounded-md mr-3">
                <BrainIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Quiz Score</CardTitle>
                <CardDescription>Average performance</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center">
              <div className="bg-red-100 p-2 rounded-md mr-3">
                <VideoIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Video Snippets</CardTitle>
                <CardDescription>Generated videos</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+4 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Notes</h2>
            <Button variant="ghost" asChild>
              <Link to="/notes">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                title={note.title}
                preview={note.preview}
                date={note.date}
                tags={note.tags}
                index={index}
                onView={() => console.log(`View note ${note.id}`)}
                onEdit={() => console.log(`Edit note ${note.id}`)}
                onDelete={() => console.log(`Delete note ${note.id}`)}
              />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed border-muted-foreground/50 bg-transparent p-8">
              <PlusIcon className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload New Notes</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add your class notes, images, or link to videos
              </p>
              <Button asChild>
                <Link to="/notes/upload">Upload Notes</Link>
              </Button>
            </Card>
          </div>
        </motion.div>

        {/* Recommended Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended Quizzes</h2>
            <Button variant="ghost" asChild>
              <Link to="/quizzes">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quizzes.map((quiz, index) => (
              <QuizCard
                key={quiz.id}
                title={quiz.title}
                totalQuestions={quiz.totalQuestions}
                completedQuestions={quiz.completedQuestions}
                difficulty={quiz.difficulty}
                index={index}
                onStart={() => console.log(`Start quiz ${quiz.id}`)}
                onContinue={() => console.log(`Continue quiz ${quiz.id}`)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
