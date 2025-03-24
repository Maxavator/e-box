
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, Shield, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  Search, ArrowRight, FileText, Fingerprint, Building
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validateSaId } from "@/utils/saIdValidation";

export const GovIdentitySection: React.FC = () => {
  const [idNumber, setIdNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState<"lookup" | "login">("lookup");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleVerify = () => {
    setIsLoading(true);
    
    // Validate SA ID
    const validation = validateSaId(idNumber);
    if (!validation.isValid) {
      setVerificationStatus("error");
      setVerificationMessage(validation.message || "Invalid South African ID number");
      setIsLoading(false);
      return;
    }
    
    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      
      if (verificationMode === "lookup") {
        // In lookup mode, we just verify the ID exists
        setVerificationStatus("success");
        setVerificationMessage("ID number verified successfully. You can now log in with your ID.");
      } else {
        // In login mode, redirect to login
        toast.success("Redirecting to secure login...");
        setTimeout(() => {
          window.location.href = "/auth";
        }, 1500);
      }
    }, 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">GovZA Identity Services</h2>
        <p className="text-muted-foreground">
          Verify your identity and access personalized government services securely.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Identity Verification
              </CardTitle>
              <CardDescription>
                Verify your South African ID to access government services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lookup" className="w-full" onValueChange={(value) => setVerificationMode(value as "lookup" | "login")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="lookup">ID Lookup</TabsTrigger>
                  <TabsTrigger value="login">Secure Login</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lookup">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="id-number">South African ID Number</Label>
                      <div className="relative">
                        <Input
                          id="id-number"
                          placeholder="Enter your 13-digit ID number"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          className="pr-10"
                          maxLength={13}
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter your 13-digit South African ID number to verify your identity.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleVerify} 
                      disabled={idNumber.length !== 13 || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Verifying..." : "Verify ID Number"}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="login">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-id">South African ID Number</Label>
                      <Input
                        id="login-id"
                        placeholder="Enter your 13-digit ID number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        maxLength={13}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleVerify} 
                      disabled={idNumber.length !== 13 || isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Processing..." : "Continue to Secure Login"}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground">
                      Your identity will be verified securely through the national identity system.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              {verificationStatus === "success" && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Verification Successful</AlertTitle>
                  <AlertDescription>
                    {verificationMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              {verificationStatus === "error" && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>
                    {verificationMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Identity Documents</CardTitle>
              <CardDescription>
                Manage your official South African identity documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 px-4 justify-start text-left" asChild>
                  <a href="/govza/services/id-documents">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <span className="font-medium block">ID Documents</span>
                        <span className="text-xs text-muted-foreground">Apply for or renew your ID card</span>
                      </div>
                    </div>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 px-4 justify-start text-left" asChild>
                  <a href="/govza/services/passports">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <span className="font-medium block">Passport</span>
                        <span className="text-xs text-muted-foreground">Apply for or renew your passport</span>
                      </div>
                    </div>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 px-4 justify-start text-left" asChild>
                  <a href="/govza/services/birth-certificates">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <span className="font-medium block">Birth Certificate</span>
                        <span className="text-xs text-muted-foreground">Request birth certificate</span>
                      </div>
                    </div>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 px-4 justify-start text-left" asChild>
                  <a href="/govza/services/marriage-certificates">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <span className="font-medium block">Marriage Certificate</span>
                        <span className="text-xs text-muted-foreground">Request marriage certificate</span>
                      </div>
                    </div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identity Security</CardTitle>
              <CardDescription>
                Protecting your digital identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Enhanced Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Your identity is protected with advanced encryption
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Biometric Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Additional security with biometric validation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Home Affairs Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Directly connected to Department of Home Affairs
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="text-center">
                <h4 className="font-medium mb-2">Report Identity Theft</h4>
                <Button variant="destructive" className="w-full">
                  Report Fraud
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                Find Home Affairs Office
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
