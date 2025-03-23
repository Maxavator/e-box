
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Upload } from "lucide-react";
import type { Profile } from "@/types/database";

type Settings = {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  jobTitle: string;
  calendarNotificationTime: number | null;
  mobilePhoneNumber: string;
  officePhoneNumber: string;
  phoneExtension: string;
};

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    desktopNotifications: false,
    darkMode: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        setSettings({
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          avatarUrl: profile?.avatar_url || null,
          jobTitle: profile?.job_title || '',
          calendarNotificationTime: profile?.calendar_notification_time || null,
          mobilePhoneNumber: profile?.mobile_phone_number || '',
          officePhoneNumber: profile?.office_phone_number || '',
          phoneExtension: profile?.phone_extension || '',
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      if (!file.type.match('image.*')) {
        toast.error('Please upload an image file');
        return;
      }

      if (file.size > 5000000) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setSettings(prev => prev ? { ...prev, avatarUrl: publicUrl } : null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: settings.firstName,
          last_name: settings.lastName,
          job_title: settings.jobTitle,
          calendar_notification_time: settings.calendarNotificationTime,
          mobile_phone_number: settings.mobilePhoneNumber,
          office_phone_number: settings.officePhoneNumber,
          phone_extension: settings.phoneExtension,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1">
          <TabsTrigger value="profile" className="flex items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 py-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and how it appears on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 pb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings?.avatarUrl || ''} alt="Profile picture" />
                  <AvatarFallback>
                    {settings?.firstName?.[0]}{settings?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This is your public profile picture visible to other users
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="self-start flex items-center gap-2"
                      onClick={handleImageUploadClick}
                      disabled={uploadingImage}
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload New Picture"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings?.firstName || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                    placeholder="Your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings?.lastName || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={settings?.jobTitle || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, jobTitle: e.target.value } : null)}
                  placeholder="Your job title"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobilePhone">Mobile Phone Number</Label>
                  <Input
                    id="mobilePhone"
                    value={settings?.mobilePhoneNumber || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, mobilePhoneNumber: e.target.value } : null)}
                    placeholder="Your mobile phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officePhone">Office Telephone Number</Label>
                  <Input
                    id="officePhone"
                    value={settings?.officePhoneNumber || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, officePhoneNumber: e.target.value } : null)}
                    placeholder="Your office telephone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneExtension">Extension (optional)</Label>
                <Input
                  id="phoneExtension"
                  value={settings?.phoneExtension || ''}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, phoneExtension: e.target.value } : null)}
                  placeholder="Extension number (if applicable)"
                />
              </div>
              
              <Button onClick={handleSave} disabled={saving} className="mt-4">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Desktop Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Show desktop notifications when you receive new messages
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.desktopNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings(prev => ({ ...prev, desktopNotifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Calendar Reminders</Label>
                  <div className="text-sm text-muted-foreground">
                    Get reminders for upcoming calendar events
                  </div>
                </div>
                <Switch
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Input type="password" value="••••••••••••" disabled className="bg-gray-50" />
                  <Button variant="outline" className="sm:ml-auto">Change Password</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last changed 3 months ago
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Two-Factor Authentication</Label>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                  <Button variant="outline">Set up 2FA</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
