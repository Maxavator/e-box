
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, Moon, User } from "lucide-react";
import { toast } from "sonner";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

export const SystemSettings = () => {
  // User Information
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [bio, setBio] = useState("System Administrator");
  const [timezone, setTimezone] = useState("utc");
  const [language, setLanguage] = useState("en");

  // Appearance Settings
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);

  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(true);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountSettings
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            bio={bio}
            setBio={setBio}
            timezone={timezone}
            setTimezone={setTimezone}
            language={language}
            setLanguage={setLanguage}
            onSave={() => handleSave('Account')}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            compactMode={compactMode}
            setCompactMode={setCompactMode}
            fontSize={fontSize}
            setFontSize={setFontSize}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            onSave={() => handleSave('Appearance')}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            emailUpdates={emailUpdates}
            setEmailUpdates={setEmailUpdates}
            weeklyDigest={weeklyDigest}
            setWeeklyDigest={setWeeklyDigest}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            desktopAlerts={desktopAlerts}
            setDesktopAlerts={setDesktopAlerts}
            onSave={() => handleSave('Notification')}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings
            twoFactorAuth={twoFactorAuth}
            setTwoFactorAuth={setTwoFactorAuth}
            sessionTimeout={sessionTimeout}
            setSessionTimeout={setSessionTimeout}
            loginAlerts={loginAlerts}
            setLoginAlerts={setLoginAlerts}
            onSave={() => handleSave('Security')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
