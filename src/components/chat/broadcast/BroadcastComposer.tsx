
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Users, Globe, Send, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function BroadcastComposer() {
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("organization");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [isSending, setIsSending] = useState(false);
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
      setIsSending(true);
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
    } finally {
      setIsSending(false);
    }
  };

  if (!userRole?.canBroadcast) {
    return (
      <Card className="border-dashed border-muted-foreground/20">
        <CardContent className="pt-6">
          <div className="text-center p-6 space-y-4">
            <div className="bg-muted/50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
              <Megaphone className="h-8 w-8 text-muted-foreground opacity-70" />
            </div>
            <h3 className="text-lg font-medium">Permission Required</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Only administrators and communication moderators can send broadcast messages.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <span>Broadcast Message</span>
          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">Admin</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-2">
          <Label htmlFor="broadcast-target" className="text-sm font-medium">
            Send to
          </Label>
          <RadioGroup
            value={targetType}
            onValueChange={setTargetType}
            className="flex flex-col space-y-2 border rounded-md p-3 bg-muted/20"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organization" id="organization" />
              <Label htmlFor="organization" className="flex items-center cursor-pointer">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Specific Organization
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="global" id="global" />
              <Label htmlFor="global" className="flex items-center cursor-pointer">
                <Globe className="h-4 w-4 mr-2 text-green-500" />
                All Users (Global)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {targetType === "organization" && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="org-select" className="text-sm font-medium">Select Organization</Label>
            <Select
              disabled={isLoading}
              value={selectedOrgId}
              onValueChange={setSelectedOrgId}
            >
              <SelectTrigger id="org-select" className="w-full">
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
            {isLoading && (
              <div className="text-xs text-muted-foreground">Loading organizations...</div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="broadcast-message" className="text-sm font-medium">Message</Label>
            <span className="text-xs text-muted-foreground">
              {message.length} characters
            </span>
          </div>
          <Textarea
            id="broadcast-message"
            placeholder="Type your broadcast message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] resize-none focus:ring-1 focus:ring-primary/30"
          />
          {!message.trim() && (
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>Message is required</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 py-3">
        <Button 
          onClick={handleSendBroadcast} 
          disabled={!message.trim() || (targetType === "organization" && !selectedOrgId) || isSending}
          className="w-full gap-2"
        >
          {isSending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="mr-1 h-4 w-4" />
              <span>Send Broadcast</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
