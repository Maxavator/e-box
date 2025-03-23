import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, Moon, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AccountSettings } from "./AccountSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SecuritySettings";

export const Settings = () => {
  // User Information
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [bio, setBio] = useState("Software Engineer passionate about building great products.");
  const [timezone, setTimezone] = useState("utc");
  const [language, setLanguage] = useState("en");

  // Appearance Settings - set darkMode to false by default
  const [darkMode, setDarkMode] = useState(false);
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

  const { toast } = useToast();

  const handleSave = (section: string) => {
    toast({
      title: `${section} settings saved`,
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set your preferences.
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
