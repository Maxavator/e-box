
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/types/database";

type Settings = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  calendarNotificationTime: number | null;
};

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

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
          .single();

        if (error) throw error;

        setSettings({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: user.email || '',
          avatarUrl: profile.avatar_url,
          calendarNotificationTime: profile.calendar_notification_time,
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

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: settings.firstName,
          last_name: settings.lastName,
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
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
