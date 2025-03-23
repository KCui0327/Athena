import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainIcon, FileTextIcon, PlusIcon, UploadIcon, VideoIcon } from "lucide-react";
import { Link } from "react-router-dom";
import NoteCard from "@/components/ui-custom/NoteCard";
import QuizCard from "@/components/ui-custom/QuizCard";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

// Define the Material interface to match your API response
interface Material {
  id: number;
  name: string;
  summary: string | null;
  created_at: string;
  file_url: string | null;
  video_url: string | null;
  video_summary: string | null;
  user_id: string;
}

const Dashboard = () => {
  const [recentNotes, setRecentNotes] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        setIsLoading(true);
        // Get user ID from local storage or auth context
        const userId = localStorage.getItem('userId') || 'default-user-id';
        
        // Create form data for the request
        const formData = new FormData();
        formData.append('user_id', userId);
        
        const response = await fetch('/api/get-all-notes', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        // Get the 3 most recent notes
        const sortedNotes = (data.materials || [])
          .sort((a: Material, b: Material) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 3);
        
        setRecentNotes(sortedNotes);
      } catch (err) {
        console.error('Failed to fetch recent notes:', err);
        setError('Failed to load recent notes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentNotes();
  }, []);

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
              Welcome back! Ready for another productive day?
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
            {isLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <Spinner className="h-6 w-6 text-primary" />
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : recentNotes.length > 0 ? (
              recentNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  title={note.name}
                  preview={note.summary || ""}
                  date={note.created_at}
                  index={index}
                  onView={() => console.log(`View note ${note.id}`)}
                  onEdit={() => console.log(`Edit note ${note.id}`)}
                  onDelete={() => console.log(`Delete note ${note.id}`)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No recent notes found.</p>
              </div>
            )}
            {/* <Card className="flex flex-col items-center justify-center border-dashed border-muted-foreground/50 bg-transparent p-8">
              <PlusIcon className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload New Notes</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add your class notes, images, or link to videos
              </p>
              <Button asChild>
                <Link to="/notes/upload">Upload Notes</Link>
              </Button>
            </Card> */}
          </div>
        </motion.div>

        {/* Recommended Quizzes
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
        </motion.div> */}
      </div>
    </AppShell>
  );
};

export default Dashboard;
