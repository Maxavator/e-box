
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoleType } from "@/types/supabase-types";
import { toast } from "sonner";
import { AlertTriangle, RefreshCw, Save } from "lucide-react";

interface ModerationSettingsProps {
  userRole: string | undefined;
}

export function ModerationSettings({ userRole }: ModerationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Set initial settings based on user role
  const [settings, setSettings] = useState({
    autoFlag: true,
    autoModerate: false,
    notifyUsers: true,
    notifyModerators: true,
    moderationLevel: userRole === 'hr_moderator' ? 'strict' : 'moderate',
    keywordsList: "confidential,private,secret",
    customMessage: "Your content has been flagged for review by our moderation team. We'll get back to you shortly."
  });
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Moderation settings saved successfully");
    }, 1000);
  };
  
  const handleResetDefaults = () => {
    // Reset to default settings
    setSettings({
      autoFlag: true,
      autoModerate: false,
      notifyUsers: true,
      notifyModerators: true,
      moderationLevel: 'moderate',
      keywordsList: "confidential,private,secret",
      customMessage: "Your content has been flagged for review by our moderation team. We'll get back to you shortly."
    });
    
    toast.info("Settings reset to defaults");
  };
  
  // Determine which settings to show based on user role
  const showAdvancedSettings = userRole === 'global_admin' || userRole === 'org_admin';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moderation Settings</CardTitle>
          <CardDescription>Configure how content moderation works in your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Automation Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-flag">Auto-flag Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically flag content matching keywords or patterns
                  </p>
                </div>
                <Switch
                  id="auto-flag"
                  checked={settings.autoFlag}
                  onCheckedChange={(checked) => setSettings({...settings, autoFlag: checked})}
                />
              </div>
              
              {showAdvancedSettings && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-moderate">Auto-moderate Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve/reject content based on rules
                    </p>
                  </div>
                  <Switch
                    id="auto-moderate"
                    checked={settings.autoModerate}
                    onCheckedChange={(checked) => setSettings({...settings, autoModerate: checked})}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-users">Notify Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to users when content is moderated
                  </p>
                </div>
                <Switch
                  id="notify-users"
                  checked={settings.notifyUsers}
                  onCheckedChange={(checked) => setSettings({...settings, notifyUsers: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-moderators">Notify Moderators</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert moderators when content is flagged
                  </p>
                </div>
                <Switch
                  id="notify-moderators"
                  checked={settings.notifyModerators}
                  onCheckedChange={(checked) => setSettings({...settings, notifyModerators: checked})}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Moderation Rules</h3>
            
            <div className="space-y-2">
              <Label htmlFor="moderation-level">Moderation Level</Label>
              <Select
                value={settings.moderationLevel}
                onValueChange={(value) => setSettings({...settings, moderationLevel: value})}
              >
                <SelectTrigger id="moderation-level">
                  <SelectValue placeholder="Select moderation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lenient">Lenient</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Determines sensitivity of automated moderation
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords-list">Keywords to Flag</Label>
              <Textarea
                id="keywords-list"
                placeholder="Enter keywords separated by commas"
                value={settings.keywordsList}
                onChange={(e) => setSettings({...settings, keywordsList: e.target.value})}
                className="h-20"
              />
              <p className="text-xs text-muted-foreground">
                Content containing these keywords will be automatically flagged
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="custom-message">Custom Message</Label>
              <Textarea
                id="custom-message"
                placeholder="Enter message for users whose content is flagged"
                value={settings.customMessage}
                onChange={(e) => setSettings({...settings, customMessage: e.target.value})}
                className="h-20"
              />
              <p className="text-xs text-muted-foreground">
                This message will be shown to users when their content is flagged
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResetDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {!showAdvancedSettings && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Limited Access</h4>
                <p className="text-sm text-amber-700">
                  Some advanced settings are only available to administrators. Contact your system administrator if you need to change these settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
