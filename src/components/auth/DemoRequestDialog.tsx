
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DemoRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoRequestDialog = ({ open, onOpenChange }: DemoRequestDialogProps) => {
  const [demoName, setDemoName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [staffSize, setStaffSize] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mobile, setMobile] = useState("");
  const [demoMessage, setDemoMessage] = useState("");
  const { toast } = useToast();

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
    
    onOpenChange(false);
    toast({
      title: "Demo Request Sent",
      description: "We'll be in touch with you shortly",
    });

    // Reset form
    setDemoName("");
    setCompanyName("");
    setStaffSize("");
    setOfficialEmail("");
    setTelephone("");
    setMobile("");
    setDemoMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default DemoRequestDialog;
