
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
import StudyGuideCard from "@/components/ui-custom/StudyGuideCard";
import { motion } from "framer-motion";

const StudyGuides = () => {
  // Sample data for study guides
  const studyGuides = [
    {
      id: 1,
      title: "Biochemistry Final Exam",
      preview: "Comprehensive guide covering enzyme kinetics, metabolic pathways, and protein structure and function.",
      date: "Updated 3 days ago",
      pages: 12,
      subject: "Biochemistry"
    },
    {
      id: 2,
      title: "World History: 1900-1950",
      preview: "Key events of the early 20th century including World Wars, the Great Depression, and major political movements.",
      date: "Updated 1 week ago",
      pages: 18,
      subject: "History"
    },
    {
      id: 3,
      title: "Calculus III: Vector Calculus",
      preview: "Detailed notes on vector fields, line integrals, surface integrals, and the theorems of Green, Stokes, and Gauss.",
      date: "Updated 2 weeks ago",
      pages: 15,
      subject: "Mathematics"
    },
    {
      id: 4,
      title: "Principles of Microeconomics",
      preview: "Overview of supply and demand, market structures, consumer choice theory, and production theory.",
      date: "Updated 3 weeks ago",
      pages: 14,
      subject: "Economics"
    },
    {
      id: 5,
      title: "Introduction to Machine Learning",
      preview: "Study guide covering supervised and unsupervised learning algorithms, model evaluation, and feature selection.",
      date: "Updated 1 month ago",
      pages: 20,
      subject: "Computer Science"
    },
    {
      id: 6,
      title: "Shakespeare's Tragedies",
      preview: "Analysis of Hamlet, Macbeth, King Lear, and Othello with key themes, characters, and literary devices.",
      date: "Updated 1 month ago",
      pages: 16,
      subject: "Literature"
    },
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
            <h1 className="text-3xl font-bold tracking-tight">Study Guides</h1>
            <p className="text-muted-foreground mt-1">
              Browse your AI-generated study guides
            </p>
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
              placeholder="Search study guides..." 
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
                  Sort
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Recently Updated</DropdownMenuItem>
                <DropdownMenuItem>Title A-Z</DropdownMenuItem>
                <DropdownMenuItem>Most Pages</DropdownMenuItem>
                <DropdownMenuItem>Least Pages</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
        
        {/* Study Guides Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {studyGuides.map((guide, index) => (
            <StudyGuideCard
              key={guide.id}
              title={guide.title}
              preview={guide.preview}
              date={guide.date}
              pages={guide.pages}
              subject={guide.subject}
              index={index}
              onView={() => console.log(`View guide ${guide.id}`)}
              onEdit={() => console.log(`Edit guide ${guide.id}`)}
              onDelete={() => console.log(`Delete guide ${guide.id}`)}
            />
          ))}
        </motion.div>
      </div>
    </AppShell>
  );
};

export default StudyGuides;
