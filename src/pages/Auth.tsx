
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [idNumber, setIdNumber] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateSAID = (id: string) => {
    const regex = /^([456])0\d{11}$/;
    return regex.test(id);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSAID(idNumber)) {
      toast({
        title: "Invalid ID Number",
        description: "Please enter a valid South African ID number",
        variant: "destructive",
      });
      return;
    }

    const isGlobalAdmin = idNumber.startsWith("4");
    const isOrgAdmin = idNumber.startsWith("5");
    
    if (isGlobalAdmin) {
      navigate("/admin");
    } else if (isOrgAdmin) {
      navigate("/organization");
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-brand-50 to-background p-4">
      <Card className="w-full max-w-md animate-fadeIn">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Enterprise Chat
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Demo Credentials
          </CardDescription>
          <div className="mt-4 space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <p><span className="font-medium">Regular User:</span> 6010203040512</p>
            <p><span className="font-medium">Organization Admin:</span> 5010203040512</p>
            <p><span className="font-medium">Global Admin:</span> 4010203040512</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="South African ID Number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
