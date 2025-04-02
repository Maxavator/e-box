
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Users, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function BroadcastComposer() {
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("organization");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const { toast } = useToast();

  // Fetch organizations for dropdown
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Check if user has permission to broadcast
  const { data: userRole, isLoading: isCheckingRole } = useQuery({
    queryKey: ['user-role-for-broadcast'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { canBroadcast: false };

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      return { 
        canBroadcast: roleData?.role === 'global_admin' || 
                     roleData?.role === 'org_admin' || 
                     roleData?.role === 'comm_moderator'
      };
    }
  });

  const handleSendBroadcast = async () => {
    if (!message.trim()) {
      toast({ 
        title: "Missing Content", 
        description: "Please enter a message to broadcast"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ 
          title: "Not Authenticated", 
          description: "You must be logged in to send broadcasts"
        });
        return;
      }

      // Send broadcast message
      const { error } = await supabase
        .from('broadcast_messages')
        .insert({
          sender_id: user.id,
          content: message,
          organization_id: targetType === "organization" ? selectedOrgId : null,
          is_global: targetType === "global"
        });

      if (error) throw error;

      toast({
        title: "Broadcast Sent",
        description: `Your message has been broadcast ${targetType === "global" ? "to all users" : "to the selected organization"}`
      });

      setMessage("");
      
    } catch (error: any) {
      console.error("Error sending broadcast:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to send broadcast message",
        variant: "destructive"
      });
    }
  };

  if (!userRole?.canBroadcast) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <Megaphone className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">Permission Required</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Only administrators and communication moderators can send broadcast messages.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          <span>Broadcast Message</span>
          <Badge variant="outline" className="ml-2">Admin</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="broadcast-target">Send to</Label>
          <RadioGroup
            value={targetType}
            onValueChange={setTargetType}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organization" id="organization" />
              <Label htmlFor="organization" className="flex items-center cursor-pointer">
                <Users className="h-4 w-4 mr-2" />
                Specific Organization
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="global" id="global" />
              <Label htmlFor="global" className="flex items-center cursor-pointer">
                <Globe className="h-4 w-4 mr-2" />
                All Users (Global)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {targetType === "organization" && (
          <div className="space-y-2">
            <Label htmlFor="org-select">Select Organization</Label>
            <Select
              disabled={isLoading}
              value={selectedOrgId}
              onValueChange={setSelectedOrgId}
            >
              <SelectTrigger id="org-select">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="broadcast-message">Message</Label>
          <Textarea
            id="broadcast-message"
            placeholder="Type your broadcast message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendBroadcast} 
          disabled={!message.trim() || (targetType === "organization" && !selectedOrgId)}
          className="w-full"
        >
          <Megaphone className="mr-2 h-4 w-4" />
          Send Broadcast
        </Button>
      </CardFooter>
    </Card>
  );
}
