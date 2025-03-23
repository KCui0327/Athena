
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
import { ChevronDownIcon, FilterIcon, PlusIcon, SearchIcon, SlidersIcon } from "lucide-react";
import NoteCard from "@/components/ui-custom/NoteCard";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Notes = () => {
  const navigate = useNavigate();

  // Sample data for notes
  const notes = [
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
    },
    {
      id: 4,
      title: "Photosynthesis Process",
      preview: "Detailed notes on the light-dependent and light-independent reactions of photosynthesis in plant cells.",
      date: "3 days ago",
      tags: ["Biology", "Cellular"]
    },
    {
      id: 5,
      title: "World War II Major Battles",
      preview: "Chronological overview of pivotal battles including Stalingrad, Normandy, Midway, and their strategic significance.",
      date: "4 days ago",
      tags: ["History", "World War II"]
    },
    {
      id: 6,
      title: "Organic Chemistry Functional Groups",
      preview: "Classification and properties of different functional groups in organic compounds with reaction mechanisms.",
      date: "5 days ago",
      tags: ["Chemistry", "Organic"]
    },
    {
      id: 7,
      title: "Shakespeare's Hamlet Analysis",
      preview: "Literary analysis of themes, characters, and symbolism in Shakespeare's tragedy Hamlet.",
      date: "1 week ago",
      tags: ["Literature", "Shakespeare"]
    },
    {
      id: 8,
      title: "Calculus: Integration Techniques",
      preview: "Methods for solving indefinite and definite integrals including substitution, parts, and partial fractions.",
      date: "1 week ago",
      tags: ["Mathematics", "Calculus"]
    },
    {
      id: 9,
      title: "Supply Chain Management",
      preview: "Overview of modern supply chain practices, optimization strategies, and digital transformation in logistics.",
      date: "2 weeks ago",
      tags: ["Business", "Logistics"]
    },
  ];

  const handleViewNote = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  };

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
            <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage all your uploaded notes
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/notes/upload">
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Notes
              </Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              className="pl-9"
            />
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <FilterIcon className="h-4 w-4" />
                  Tags
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Tags</DropdownMenuItem>
                <DropdownMenuItem>Physics</DropdownMenuItem>
                <DropdownMenuItem>Mathematics</DropdownMenuItem>
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
                  Sort
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Most Recent</DropdownMenuItem>
                <DropdownMenuItem>Oldest First</DropdownMenuItem>
                <DropdownMenuItem>A-Z</DropdownMenuItem>
                <DropdownMenuItem>Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
        
        {/* Notes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {notes.map((note, index) => (
            <NoteCard
              key={note.id}
              title={note.title}
              preview={note.preview}
              date={note.date}
              tags={note.tags}
              index={index}
              onView={() => handleViewNote(note.id)}
              onEdit={() => console.log(`Edit note ${note.id}`)}
              onDelete={() => console.log(`Delete note ${note.id}`)}
            />
          ))}
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Notes;
