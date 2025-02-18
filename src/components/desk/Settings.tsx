
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Database } from "@/integrations/supabase/types";

type CalendarNotificationTime = Database['public']['Enums']['calendar_notification_time'];

type ProfileType = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  defaultNotificationTime: CalendarNotificationTime;
};

export const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    desktopNotifications: false,
    darkMode: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: user.email || '',
          avatarUrl: profileData.avatar_url,
          defaultNotificationTime: profileData.default_notification_time,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          default_notification_time: profile.defaultNotificationTime,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile?.firstName || ''}
              onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
              placeholder="Your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile?.lastName || ''}
              onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
              placeholder="Your last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <div className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </div>
            </div>
            <Switch
              checked={notificationSettings.darkMode}
              onCheckedChange={(checked) =>
                setNotificationSettings(prev => ({ ...prev, darkMode: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
