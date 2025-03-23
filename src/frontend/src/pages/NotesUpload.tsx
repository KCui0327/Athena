import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const NotesUpload = () => {
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState<{ title?: string; course?: string; file?: string }>({});

  const courses = [
    { id: 1, name: "Introduction to Physics" },
    { id: 2, name: "Macroeconomics 101" },
    { id: 3, name: "Computer Science Fundamentals" },
    { id: 4, name: "World History: Modern Era" },
    { id: 5, name: "Organic Chemistry" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadedFile(null);
  };

  const handleUpload = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!selectedCourse) newErrors.course = "Course must be selected";
    if (!uploadedFile) newErrors.file = "Please upload a PDF or image file";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload: any = {
      material: {
        text: null,
        course_id: Number(selectedCourse),
        doc_id: 1, // TODO: replace with actual doc_id
        embedding: [], // TODO: generate embedding
      },
      metadata: {
        user_id: 1, // TODO: replace with actual user ID
        created_at: new Date().toISOString(),
      },
    };

    if (videoUrl.trim()) {
      payload.video = {
        video_id: videoUrl,
        user_id: 1, // TODO: replace with actual user ID
        length: 0, // TODO: replace with video length if known
        created_at: new Date().toISOString(),
      };
    }

    console.log("Prepared Payload:", payload);
    // TODO: Submit payload to backend
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
            <h1 className="text-3xl font-bold tracking-tight">Upload Notes</h1>
            <p className="text-muted-foreground mt-1">
              Add your notes, images, or link to videos
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Note Details</CardTitle>
                <CardDescription>
                  Enter the information about your notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Note Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.course && <p className="text-sm text-red-500">{errors.course}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-upload">Upload Notes (PDF or Image)</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6">
                    <label
                      htmlFor="note-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium mb-1">Drag & drop or click to upload</span>
                      <span className="text-xs text-muted-foreground mb-2">
                        PDF, PNG, JPG up to 10MB
                      </span>
                      <Input
                        id="note-upload"
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {errors.file && <p className="text-sm text-red-500 mt-2">{errors.file}</p>}

                  {imagePreview && (
                    <div className="relative mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Add Video Link</CardTitle>
                <CardDescription>
                  Link to a YouTube or Vimeo video (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="videoUrl"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <Button variant="outline" size="icon">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supports YouTube, Vimeo, and more
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-end mt-6"
        >
          <Button onClick={handleUpload}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload and Process
          </Button>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default NotesUpload;
