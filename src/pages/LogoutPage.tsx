
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleLogin = () => {
    navigate("/auth");
  };
  
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    
    try {
      // Save feedback to database if connected to Supabase
      const { error } = await supabase
        .from('user_feedback')
        .insert({ feedback });
        
      if (error) throw error;
      
      toast.success("Thank you for your feedback!");
      setSubmitted(true);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.success("Thank you for your feedback!"); // Still show success even if DB insert fails
      setSubmitted(true);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <img 
              src="/lovable-uploads/dbb30299-d801-4939-9dd4-ef26c4cc55cd.png" 
              alt="e-Box Logo" 
              className="h-16" 
            />
          </div>
          <CardTitle className="text-xl">Thank You!</CardTitle>
          <CardDescription>
            You have been successfully logged out of your account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Help us improve</h3>
            <Textarea
              placeholder="Is there anything we could improve? Your feedback is valuable to us."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              disabled={submitted}
            />
            {!submitted ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                onClick={handleFeedbackSubmit}
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </Button>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Thank you for your feedback!
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log Back In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
