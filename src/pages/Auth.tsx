import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, Users, Globe, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoMessage, setDemoMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [staffSize, setStaffSize] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Invalid Credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    const isGlobalAdmin = username.startsWith("admin");
    const isOrgAdmin = username.startsWith("org");
    
    if (isGlobalAdmin) {
      navigate("/admin");
    } else if (isOrgAdmin) {
      navigate("/organization");
    } else {
      navigate("/chat");
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  };

  const handleDemoRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demoName || !companyName || !staffSize || !officialEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(officialEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (telephone && !validatePhone(telephone)) {
      toast({
        title: "Invalid Telephone Number",
        description: "Please enter a valid international telephone number (e.g., +27123456789)",
        variant: "destructive",
      });
      return;
    }

    if (mobile && !validatePhone(mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid international mobile number (e.g., +27123456789)",
        variant: "destructive",
      });
      return;
    }

    const subject = encodeURIComponent("e-Box Demo Request");
    const body = encodeURIComponent(
      `Name: ${demoName}\n` +
      `Company: ${companyName}\n` +
      `Staff Size: ${staffSize}\n` +
      `Official Email: ${officialEmail}\n` +
      `Telephone: ${telephone}\n` +
      `Mobile: ${mobile}\n` +
      `Message: ${demoMessage}`
    );
    window.location.href = `mailto:support@afrovation.com?subject=${subject}&body=${body}`;
    
    setIsDemoDialogOpen(false);
    toast({
      title: "Demo Request Sent",
      description: "We'll be in touch with you shortly",
    });

    setDemoName("");
    setCompanyName("");
    setStaffSize("");
    setOfficialEmail("");
    setTelephone("");
    setMobile("");
    setDemoMessage("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-stretch bg-gradient-to-b from-brand-50 to-background">
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary animate-fadeIn">
            e-Box by Afrovation
          </h1>
          <p className="text-xl text-gray-600 animate-fadeIn delay-100">
            Secure, scalable, and efficient communication for your organization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-200">
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

          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-300">
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

          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-400">
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

          <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary/5 transition-colors animate-fadeIn delay-500">
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

        <div className="pt-4 animate-fadeIn delay-600">
          <img 
            src="/lovable-uploads/cea5cf65-708e-42c4-9a6c-6073f42a3471.png" 
            alt="e-Box Preview" 
            className="rounded-lg shadow-xl max-w-md mx-auto hover:shadow-2xl transition-shadow duration-300"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm">
        <Card className="w-full max-w-md animate-fadeIn shadow-xl hover:shadow-2xl transition-shadow duration-300 border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Welcome to e-Box
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full focus:ring-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
              >
                Login
              </Button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setIsDemoDialogOpen(true)}
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Request a Demo
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request a Demo</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDemoRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demoName">Name *</Label>
              <Input
                id="demoName"
                placeholder="Your name"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company or Organisation Name *</Label>
              <Input
                id="companyName"
                placeholder="Your company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffSize">Number of Staff *</Label>
              <Select value={staffSize} onValueChange={setStaffSize} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select staff size range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-49">0-49</SelectItem>
                  <SelectItem value="50-499">50-499</SelectItem>
                  <SelectItem value="500-999">500-999</SelectItem>
                  <SelectItem value="1000-4999">1,000-4,999</SelectItem>
                  <SelectItem value="5000-9999">5,000-9,999</SelectItem>
                  <SelectItem value="10000-19999">10,000-19,999</SelectItem>
                  <SelectItem value="20000-49999">20,000-49,999</SelectItem>
                  <SelectItem value="50000+">More than 50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="officialEmail">Official Email Address *</Label>
              <Input
                id="officialEmail"
                type="email"
                placeholder="your.name@company.com"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone Number</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="+27123456789"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+27123456789"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoMessage">Additional Information</Label>
              <Textarea
                id="demoMessage"
                placeholder="Tell us about your requirements..."
                value={demoMessage}
                onChange={(e) => setDemoMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                Send Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
