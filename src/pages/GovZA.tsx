
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Flag, Info, Globe, Shield, Clock, Building2, Inbox, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { GovServicesSection } from "@/components/govza/GovServicesSection";
import { HomeAffairsSection } from "@/components/govza/departments/HomeAffairsSection";
import { TransportSection } from "@/components/govza/departments/TransportSection";
import { SarsSection } from "@/components/govza/departments/SarsSection";
import { SassaSection } from "@/components/govza/departments/SassaSection";
import { NsfasSection } from "@/components/govza/departments/NsfasSection";
import { MunicipalServicesSection } from "@/components/govza/departments/MunicipalServicesSection";
import { GovInbox } from "@/components/govza/GovInbox";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function GovZA() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile } = useMediaQuery();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Effect to track tab changes in URL for better mobile navigation
  useEffect(() => {
    const tabFromHash = window.location.hash.replace("#", "");
    if (tabFromHash && ["overview", "inbox", "home-affairs", "sars", "transport", "sassa", "nsfas", "municipal"].includes(tabFromHash)) {
      setActiveTab(tabFromHash);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };
  
  const renderMobileTabsList = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mb-2">
          <Menu className="h-4 w-4 mr-2" />
          {getTabLabel(activeTab)}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh]">
        <div className="pt-6 pb-2">
          <h3 className="font-medium mb-2">Government Services</h3>
          <div className="flex flex-col space-y-1">
            {tabOptions.map((tab) => (
              <Button 
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "ghost"} 
                className="justify-start"
                onClick={() => {
                  handleTabChange(tab.value);
                  document.querySelector('[data-radix-collection-item]')?.click(); // Close sheet
                }}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  const renderDesktopTabsList = () => (
    <TabsList className="w-full justify-start overflow-x-auto mb-4">
      {tabOptions.map((tab) => (
        <TabsTrigger 
          key={tab.value}
          value={tab.value} 
          className="px-4 flex items-center gap-2"
          onClick={() => handleTabChange(tab.value)}
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
  
  return (
    <div className="container max-w-7xl mx-auto py-4 md:py-6 px-4 md:px-6">
      <div className="flex items-center mb-4">
        <Flag className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">South African Government Services</h1>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 md:p-6 rounded-lg mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to South African Government Services</h2>
        <p className="text-sm md:text-base">
          Access South African government services directly from your device. Find information, submit
          applications, and track your requests - all in one place.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6 md:mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for government services..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90 w-full md:w-auto">
          Search
        </Button>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={handleTabChange} 
        className="mb-8"
      >
        {isMobile ? renderMobileTabsList() : renderDesktopTabsList()}
        
        <TabsContent value="overview">
          <GovServicesSection searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="inbox">
          <GovInbox />
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
        
        <TabsContent value="nsfas">
          <NsfasSection />
        </TabsContent>
        
        <TabsContent value="municipal">
          <MunicipalServicesSection />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6 md:my-8" />
      
      <footer className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          © Republic of South Africa, e-Box Government Services Portal. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-2">
          <Link to="/govza/terms" className="text-xs text-primary hover:underline">Terms of Use</Link>
          <Link to="/govza/privacy" className="text-xs text-primary hover:underline">Privacy Policy</Link>
          <Link to="/govza/accessibility" className="text-xs text-primary hover:underline">Accessibility</Link>
          <Link to="/govza/contact" className="text-xs text-primary hover:underline">Contact</Link>
        </div>
      </footer>
    </div>
  );
}

// Tab options data
const tabOptions = [
  { value: "overview", label: "Overview", icon: Globe },
  { value: "inbox", label: "Inbox", icon: Inbox },
  { value: "home-affairs", label: "Home Affairs", icon: Shield },
  { value: "sars", label: "SARS", icon: Building2 },
  { value: "transport", label: "Transport", icon: Info },
  { value: "sassa", label: "SASSA", icon: Info },
  { value: "nsfas", label: "NSFAS", icon: Info },
  { value: "municipal", label: "Municipal Services", icon: Building2 },
];

// Helper function to get tab label
function getTabLabel(value: string): string {
  const tab = tabOptions.find(tab => tab.value === value);
  return tab ? tab.label : "Overview";
}
