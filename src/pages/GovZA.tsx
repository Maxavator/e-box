
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, FileText, Clock, Users, Search, ExternalLink, Shield, Globe, Info, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { GovServicesSection } from "@/components/govza/GovServicesSection";
import { GovInformationSection } from "@/components/govza/GovInformationSection";
import { GovIdentitySection } from "@/components/govza/GovIdentitySection";

export default function GovZA() {
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Flag className="h-8 w-8 text-primary mr-3" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">GovZA Portal</h1>
            <p className="text-muted-foreground">
              South African Government Services
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for services..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/govza/help">
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="mb-8 bg-muted/50 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">Secure Access</h3>
              <p className="text-sm text-muted-foreground">
                Access government services with your South African ID
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Globe className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">All Services</h3>
              <p className="text-sm text-muted-foreground">
                One portal for all your government needs
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Clock className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">24/7 Availability</h3>
              <p className="text-sm text-muted-foreground">
                Access services anytime, anywhere
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="services" className="flex gap-2 items-center">
            <Building2 className="h-4 w-4" />
            <span>Services</span>
          </TabsTrigger>
          <TabsTrigger value="information" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span>Information</span>
          </TabsTrigger>
          <TabsTrigger value="identity" className="flex gap-2 items-center">
            <Users className="h-4 w-4" />
            <span>Identity</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-0">
          <GovServicesSection searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="information" className="mt-0">
          <GovInformationSection searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="identity" className="mt-0">
          <GovIdentitySection />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <footer className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          © Republic of South Africa, e-Box GovZA Portal. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <Link to="/govza/terms" className="text-xs text-primary hover:underline">Terms of Use</Link>
          <Link to="/govza/privacy" className="text-xs text-primary hover:underline">Privacy Policy</Link>
          <Link to="/govza/accessibility" className="text-xs text-primary hover:underline">Accessibility</Link>
          <Link to="/govza/contact" className="text-xs text-primary hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
