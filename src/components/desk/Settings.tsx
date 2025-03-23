import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Info } from "lucide-react";
import type { Profile } from "@/types/database";

type Settings = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  jobTitle: string;
  calendarNotificationTime: number | null;
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
          email: user.email || '',
          avatarUrl: profile?.avatar_url || null,
          jobTitle: profile?.job_title || '',
          calendarNotificationTime: profile?.calendar_notification_time || null,
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
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 mb-4">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={settings?.avatarUrl || ''} alt="Profile picture" />
                <AvatarFallback>
                  {settings?.firstName?.[0]}{settings?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
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
                  className="flex items-center gap-2"
                  onClick={handleImageUploadClick}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Uploading..." : "Upload New Picture"}
                </Button>
                <div className="mt-2 text-sm text-muted-foreground flex items-start gap-1.5">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Accepted formats: JPG, PNG, GIF. Maximum file size: 5MB.
                  </span>
                </div>
              </div>
            </div>
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={settings?.jobTitle || ''}
              onChange={(e) => setSettings(prev => prev ? { ...prev, jobTitle: e.target.value } : null)}
              placeholder="Your job title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
};
