
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Shield, Lock } from "lucide-react";

export function ProfileSettings() {
  const { profile, loading } = useUserProfile();
  const [isPrivate, setIsPrivate] = useState(profile?.is_private || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePrivacyToggle = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_private: !isPrivate })
        .eq('id', profile?.id);
      
      if (error) throw error;
      
      setIsPrivate(!isPrivate);
      toast({
        title: "Privacy settings updated",
        description: isPrivate 
          ? "Your profile is now visible to other users." 
          : "Your profile is now private and won't appear in user searches.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['sidebar-profile'] });
      
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error updating privacy settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Loading your privacy settings...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control how your profile appears to other users on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="private-profile" className="text-base">Private Profile</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, your profile won't appear in user searches and you can't receive new connection requests.
              </p>
            </div>
            <Switch
              id="private-profile"
              checked={isPrivate}
              onCheckedChange={handlePrivacyToggle}
              disabled={isUpdating}
            />
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4" />
              Profile Information Visibility
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              The following information is visible to other users when they find your profile:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              <li>Full name</li>
              <li>Province (from your South African ID)</li>
              <li>Date of birth (from your South African ID)</li>
              {profile?.organization_id && (
                <li>Organization membership</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
