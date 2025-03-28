
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState, Dispatch, SetStateAction } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileSettings } from "@/components/user/ProfileSettings";

interface AccountSettingsProps {
  name?: string;
  setName?: Dispatch<SetStateAction<string>>;
  email?: string;
  setEmail?: Dispatch<SetStateAction<string>>;
  phone?: string;
  setPhone?: Dispatch<SetStateAction<string>>;
  bio?: string;
  setBio?: Dispatch<SetStateAction<string>>;
  timezone?: string;
  setTimezone?: Dispatch<SetStateAction<string>>;
  language?: string;
  setLanguage?: Dispatch<SetStateAction<string>>;
  onSave?: () => void;
}

export function AccountSettings(props: AccountSettingsProps) {
  const { toast } = useToast();
  const { userDisplayName, userJobTitle, organizationName, loading } = useUserProfile();

  // If we're provided with props, use them, otherwise just use the component standalone
  const hasExternalProps = !!props.name || !!props.email;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <ProfileSettings />
    </div>
  );
}
