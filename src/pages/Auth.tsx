
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, Users, Globe } from "lucide-react";

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
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-gradient-to-b from-brand-50 to-background">
      {/* Hero Section */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Enterprise Chat Platform
          </h1>
          <p className="text-xl text-gray-600">
            Secure, scalable, and efficient communication for your organization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Enterprise Security</h3>
              <p className="text-sm text-gray-600">
                Advanced encryption and compliance features to protect your data
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Team Collaboration</h3>
              <p className="text-sm text-gray-600">
                Seamless communication across departments and organizations
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Multi-Org Support</h3>
              <p className="text-sm text-gray-600">
                Manage multiple organizations with advanced admin controls
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Global Accessibility</h3>
              <p className="text-sm text-gray-600">
                Access your workspace from anywhere, on any device
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <img 
            src="/lovable-uploads/cea5cf65-708e-42c4-9a6c-6073f42a3471.png" 
            alt="Platform Preview" 
            className="rounded-lg shadow-xl max-w-md mx-auto"
          />
        </div>
      </div>

      {/* Auth Section */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-white/50 backdrop-blur-sm">
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
