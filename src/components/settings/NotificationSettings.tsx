
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { BellRing, Mail, Clock } from "lucide-react";

interface NotificationSettingsProps {
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  emailUpdates: boolean;
  setEmailUpdates: (value: boolean) => void;
  weeklyDigest: boolean;
  setWeeklyDigest: (value: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  desktopAlerts: boolean;
  setDesktopAlerts: (value: boolean) => void;
  onSave: () => void;
}

export const NotificationSettings = ({
  pushNotifications,
  setPushNotifications,
  emailUpdates,
  setEmailUpdates,
  weeklyDigest,
  setWeeklyDigest,
  soundEnabled,
  setSoundEnabled,
  desktopAlerts,
  setDesktopAlerts,
  onSave,
}: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4" />
                <Label>Push Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Label>Email Updates</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive email notifications
              </p>
            </div>
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Label>Weekly Digest</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Get a summary of your weekly activity
              </p>
            </div>
            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for important alerts
              </p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Desktop Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Show desktop notifications
              </p>
            </div>
            <Switch checked={desktopAlerts} onCheckedChange={setDesktopAlerts} />
          </div>
        </div>
        <Button onClick={onSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};
