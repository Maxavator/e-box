
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

interface SecuritySettingsProps {
  twoFactorAuth: boolean;
  setTwoFactorAuth: (value: boolean) => void;
  sessionTimeout: boolean;
  setSessionTimeout: (value: boolean) => void;
  loginAlerts: boolean;
  setLoginAlerts: (value: boolean) => void;
  onSave: () => void;
}

export const SecuritySettings = ({
  twoFactorAuth,
  setTwoFactorAuth,
  sessionTimeout,
  setSessionTimeout,
  loginAlerts,
  setLoginAlerts,
  onSave,
}: SecuritySettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after inactivity
              </p>
            </div>
            <Switch checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of new login attempts
              </p>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Button variant="outline" className="w-full justify-start">
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
        </div>
        <Button onClick={onSave}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};
