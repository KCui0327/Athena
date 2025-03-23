
import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Settings = () => {
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
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account preferences and settings
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/images/avatar.jpg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <Button variant="outline" size="sm">
                            Upload
                          </Button>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" value="Jane" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" value="Doe" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value="jane.doe@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Tell us about yourself..." />
                    </div>
                    
                    <Button>Save changes</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Educational Information</CardTitle>
                    <CardDescription>
                      Update your educational details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input id="institution" placeholder="Your university or school" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="field">Field of Study</Label>
                      <Input id="field" placeholder="Your major or focus area" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Study Year</Label>
                      <Input id="year" placeholder="e.g. Sophomore, Junior, Senior" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interests">Study Interests</Label>
                      <Input id="interests" placeholder="e.g. Mathematics, Physics, Literature" />
                    </div>
                    
                    <Button>Save changes</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you receive and how
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Study Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Receive reminders about your study schedule
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Content</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new study materials are generated
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Quiz Results</p>
                          <p className="text-sm text-muted-foreground">
                            Receive emails with your quiz results
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotions</p>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about new features and offers
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Study Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Receive reminders about your study schedule
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Content</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new study materials are generated
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button>Change Password</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Account</CardTitle>
                    <CardDescription>
                      Control your account settings and connected services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Connected Accounts</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-sm text-muted-foreground">
                              Connect to sync notes and calendars
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Microsoft</p>
                            <p className="text-sm text-muted-foreground">
                              Connect to sync OneDrive documents
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Connect</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Data & Privacy</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Download My Data</p>
                            <p className="text-sm text-muted-foreground">
                              Get a copy of all your data stored in Athena
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default Settings;
