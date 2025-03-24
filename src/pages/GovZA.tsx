
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Flag, Info, Globe, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { GovServicesSection } from "@/components/govza/GovServicesSection";
import { HomeAffairsSection } from "@/components/govza/departments/HomeAffairsSection";
import { TransportSection } from "@/components/govza/departments/TransportSection";
import { SarsSection } from "@/components/govza/departments/SarsSection";
import { SassaSection } from "@/components/govza/departments/SassaSection";

export default function GovZA() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-4">
        <Flag className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-2xl font-bold tracking-tight">GovZA Services</h1>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome to GovZA Services</h2>
        <p>
          Access South African government services directly from your device. Find information, submit
          applications, and track your requests - all in one place.
        </p>
      </div>
      
      <div className="flex items-center gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for government services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          Search
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="w-full justify-start overflow-x-auto mb-4">
          <TabsTrigger value="overview" className="px-4">Overview</TabsTrigger>
          <TabsTrigger value="home-affairs" className="px-4">Home Affairs</TabsTrigger>
          <TabsTrigger value="sars" className="px-4">SARS</TabsTrigger>
          <TabsTrigger value="transport" className="px-4">Transport</TabsTrigger>
          <TabsTrigger value="sassa" className="px-4">SASSA</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <GovServicesSection searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="home-affairs">
          <HomeAffairsSection />
        </TabsContent>
        
        <TabsContent value="sars">
          <SarsSection />
        </TabsContent>
        
        <TabsContent value="transport">
          <TransportSection />
        </TabsContent>
        
        <TabsContent value="sassa">
          <SassaSection />
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
