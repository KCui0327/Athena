
import React from "react";
import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  FileIcon,
  VideoIcon,
  BrainIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";

const NoteDetail = () => {
  const { id } = useParams();
  
  // Mock data - in a real app, this would come from an API call using the ID
  const note = {
    id: parseInt(id || "1"),
    title: "Quantum Mechanics Introduction",
    content: "The fundamental principles of quantum mechanics, including wave-particle duality, superposition, and measurement theory.",
    fullContent: [
      {
        heading: "Wave-Particle Duality",
        text: "Wave-particle duality is a concept in quantum mechanics that states that every particle or quantum entity may be described as either a particle or a wave. It expresses the inability of the classical concepts of 'particle' or 'wave' to fully describe the behavior of quantum-scale objects."
      },
      {
        heading: "Superposition Principle",
        text: "The superposition principle states that any two (or more) quantum states can be added together, and the result will be another valid quantum state. Conversely, every quantum state can be represented as a sum of two or more distinct quantum states."
      },
      {
        heading: "Measurement Theory",
        text: "In quantum mechanics, a measurement is the testing or manipulation of a physical system in order to yield a numerical result. The unique feature of measurement in quantum mechanics is that the process of measuring generally changes the state of the system."
      },
      {
        heading: "Heisenberg Uncertainty Principle",
        text: "The Heisenberg uncertainty principle states that the position and the velocity of an object cannot both be measured exactly, at the same time, even in theory. The very concepts of exact position and exact velocity together have no meaning in nature."
      }
    ],
    date: "2 hours ago",
    // tags: ["Physics", "Quantum"],
    pdfUrl: "/placeholder.svg", // In a real app, this would be the actual PDF URL
    videoId: "5" // ID to link to the related video
  };

  // Function to generate a quiz based on the note
  const generateQuiz = () => {
    toast.success("Quiz generation started", {
      description: "Your quiz is being generated from these notes."
    });
    // In a real app, this would make an API call to generate a quiz
    // For now, we'll just redirect to the quizzes page
    setTimeout(() => {
      window.location.href = "/quizzes";
    }, 2000);
  };

  return (
    <AppShell>
      <div className="px-6 py-6 md:px-10 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Back button and actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/notes">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Notes
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <Link to={`/videos`} state={{ highlightId: note.videoId }}>
                  <VideoIcon className="mr-2 h-4 w-4" />
                  View Related Video
                </Link>
              </Button>
              <Button
                onClick={generateQuiz}
                size="sm"
              >
                <BrainIcon className="mr-2 h-4 w-4" />
                Generate Quiz
              </Button>
            </div>
          </div>

          {/* Note title and metadata */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-muted-foreground">{note.date}</p>
              <div className="flex gap-2">
                {/* {note.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))} */}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Note content */}
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpenIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Note Summary</h2>
                </div>
                <div className="space-y-4">
                  {note.fullContent.map((section, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-medium">{section.heading}</h3>
                      <p className="text-muted-foreground">{section.text}</p>
                      {index < note.fullContent.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default NoteDetail;
