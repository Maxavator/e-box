
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ProfileSettings() {
  const { profile, loading, refreshProfile } = useUserProfile();
  
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [saId, setSaId] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Initialize form with profile data when available
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setJobTitle(profile.job_title || "");
      setIsPrivate(profile.is_private || false);
      setSaId(profile.sa_id || "");
      setProvince(profile.province || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          job_title: jobTitle,
          is_private: isPrivate,
          sa_id: saId
          // Note: province is calculated automatically by a database trigger based on SA ID
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      refreshProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your personal information and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="Enter your first name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Enter your last name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input 
              id="jobTitle" 
              placeholder="Enter your job title" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="saId">SA ID Number</Label>
            <Input 
              id="saId" 
              placeholder="Enter your South African ID number" 
              value={saId}
              onChange={(e) => setSaId(e.target.value)}
            />
            {province && (
              <p className="text-sm text-muted-foreground mt-1">
                Province: {province} (automatically determined from ID)
              </p>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Privacy Settings</Label>
              <p className="text-sm text-muted-foreground">
                Control the visibility of your profile information
              </p>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {isPrivate 
              ? "Your profile is currently private. Only organization admins can see your details." 
              : "Your profile is currently visible to other users in your organization."}
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveProfile} 
            disabled={isSaving || loading}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
