import React, { useState, useEffect, useMemo } from "react";
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
import { Spinner } from "../components/ui/spinner"; // You may need to create this component

// Update the Material interface to match the API response
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

const Notes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMethod, setSortMethod] = useState("recent");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update the fetchMaterials function to use the correct API endpoint and form data
  useEffect(() => {
    const fetchMaterials = async () => {
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
        setMaterials(data.materials || []);
      } catch (err) {
        console.error('Failed to fetch materials:', err);
        setError('Failed to load notes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Update the filtered materials to use the correct properties
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => 
      (material.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (material.summary?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [materials, searchQuery]);

  // Update the sorting logic to use created_at
  const sortedMaterials = useMemo(() => {
    const materialsToSort = [...filteredMaterials];
    
    switch (sortMethod) {
      case "recent":
        return materialsToSort.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return materialsToSort.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "az":
        return materialsToSort.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case "za":
        return materialsToSort.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return materialsToSort;
    }
  }, [filteredMaterials, sortMethod]);

  const handleViewNote = (noteId: number) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <AppShell>
      <div className="px-6 py-6 md:px-10 md:py-8">
        {/* Header section */}
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
        </motion.div>
        
        {/* Search and Filter section */}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            {/* Tags dropdown */}
            <DropdownMenu>
              {/* ... your existing tags dropdown ... */}
            </DropdownMenu>
            
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <SlidersIcon className="h-4 w-4" />
                  Sort
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setSortMethod("recent")}>Most Recent</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortMethod("oldest")}>Oldest First</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortMethod("az")}>A-Z</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortMethod("za")}>Z-A</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
        
        {/* Notes Grid with loading, error, and empty states */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading ? (
            <div className="col-span-full flex justify-center py-16">
              <div className="flex flex-col items-center">
                <Spinner className="h-8 w-8 text-primary" />
                <span className="mt-4 text-sm text-muted-foreground">Loading your notes...</span>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <p className="text-red-500 mb-2">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : sortedMaterials.length > 0 ? (
            sortedMaterials.map((material, index) => (
              <NoteCard
                key={material.id}
                title={material.name || 'Untitled'}
                preview={material.summary || 'No summary available'}
                date={new Date(material.created_at).toLocaleDateString()}
                index={index}
                onView={() => handleViewNote(material.id)}
                onEdit={() => console.log(`Edit note ${material.id}`)}
                onDelete={() => console.log(`Delete note ${material.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              {searchQuery ? (
                <p className="text-muted-foreground">No notes found matching your search.</p>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-4">You don't have any notes yet.</p>
                  <Button asChild>
                    <Link to="/notes/upload">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Upload Your First Note
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Notes;
