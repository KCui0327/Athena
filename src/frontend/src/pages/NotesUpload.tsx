import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileIcon, LinkIcon, PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const NotesUpload = () => {
  const [title, setTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [errors, setErrors] = useState<{ title?: string; course?: string; file?: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);

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

  const handleUpload = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setUploadStatus({ success: false, message: "You must be logged in to upload." });
      return;
    }

    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!selectedCourse) newErrors.course = "Course must be selected";
    if (!uploadedFile) newErrors.file = "Please upload a PDF or image file";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("name", title);
    formData.append("user_id", user.uid); // Firebase UID
    if (videoUrl.trim()) {
      formData.append("video_url", videoUrl);
    }

    try {
      setIsUploading(true);
      const response = await fetch("http://localhost:8000/upload-material/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      setTitle("");
      setSelectedCourse(null);
      setUploadedFile(null);
      setImagePreview(null);
      setVideoUrl("");
      setUploadStatus({ success: true, message: "Notes uploaded successfully!" });

    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : "An unknown error occurred" 
      });
    } finally {
      setIsUploading(false);
    }
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

        {/* Unified Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Materials</CardTitle>
              <CardDescription>
                Enter information about your notes and any related content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Note Title */}
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

              {/* File Upload */}
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

              <Separator className="my-4" />

              {/* Video Link Section */}
              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Label htmlFor="videoUrl">Add Related Video (Optional)</Label>
                </div>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Supports YouTube, Vimeo, and more
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Status and Button Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardContent className="flex flex-col items-center justify-center p-8">
              {uploadStatus && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`w-full mb-6 p-4 rounded-lg shadow-sm ${
                    uploadStatus.success 
                      ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' 
                      : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50'
                  }`}
                >
                  <div className="flex items-center">
                    {uploadStatus.success ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{uploadStatus.success ? 'Success!' : 'Error'}</h4>
                      <p className="text-sm">{uploadStatus.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Ready to Process Your Notes?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Click the button below to upload and process your materials. We'll analyze your content 
                  and prepare it for learning.
                </p>
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                size="lg"
                className="px-8 py-6 h-auto text-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isUploading ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-3 border-current border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-3 h-5 w-5" />
                    Upload and Process
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default NotesUpload;
