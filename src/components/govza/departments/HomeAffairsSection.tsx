
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User, FileText, Clock } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  processingTime: string;
  location: string;
}

const ServiceCard = ({ icon, title, description, processingTime, location }: ServiceCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-start mb-3">
          {icon}
          <div className="ml-3">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Processing time:</span>
          <span className="font-medium">{processingTime}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-muted-foreground">Available at:</span>
          <span className="font-medium">{location}</span>
        </div>
        <Button variant="default" className="w-full">Apply Now</Button>
      </div>
    </Card>
  );
};

export const HomeAffairsSection = () => {
  return (
    <div>
      <Card className="bg-orange-50 border-orange-200 mb-6">
        <div className="flex items-start p-6">
          <User className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Department of Home Affairs</h2>
            <p className="text-muted-foreground">
              Services related to identification, citizenship, immigration, and civil registry
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="identity" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="immigration">Immigration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="identity">
          <h3 className="text-lg font-semibold mb-4">Identity Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceCard
              icon={<User className="h-6 w-6 text-primary" />}
              title="Apply for ID"
              description="First-time ID application for South African citizens"
              processingTime="7-10 working days"
              location="Any Home Affairs office"
            />
            
            <ServiceCard
              icon={<User className="h-6 w-6 text-primary" />}
              title="Replace Lost ID"
              description="Apply for a replacement if your ID is lost or stolen"
              processingTime="7-10 working days"
              location="Any Home Affairs office"
            />
            
            <ServiceCard
              icon={<User className="h-6 w-6 text-primary" />}
              title="Smart ID Card"
              description="Upgrade from green ID book to Smart ID card"
              processingTime="7-10 working days"
              location="Select Home Affairs offices"
            />
            
            <ServiceCard
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Check ID Status"
              description="Check the application status of your ID document"
              processingTime="Immediate"
              location="Online service"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="travel">
          <h3 className="text-lg font-semibold mb-4">Travel Documents</h3>
          <p className="text-muted-foreground mb-4">
            Services related to passports and travel documents
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Travel-related service cards would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="certificates">
          <h3 className="text-lg font-semibold mb-4">Certificates</h3>
          <p className="text-muted-foreground mb-4">
            Birth, death, and marriage certificates
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certificate-related service cards would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="immigration">
          <h3 className="text-lg font-semibold mb-4">Immigration Services</h3>
          <p className="text-muted-foreground mb-4">
            Visa, permanent residence, and immigration services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Immigration-related service cards would go here */}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Home Affairs Office Locator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg p-6 flex items-center justify-center text-muted-foreground">
              Map will display here
            </div>
            <div>
              <h4 className="font-medium mb-2">Find Home Affairs Office</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Locate your nearest Home Affairs office for in-person services.
              </p>
              <div className="space-y-2">
                <Card className="p-3 hover:bg-muted/50 cursor-pointer">
                  Pretoria - Akasia
                </Card>
                <Card className="p-3 hover:bg-muted/50 cursor-pointer">
                  Johannesburg - Harrison Street
                </Card>
                <Card className="p-3 hover:bg-muted/50 cursor-pointer">
                  Cape Town - Barrack Street
                </Card>
                <Card className="p-3 hover:bg-muted/50 cursor-pointer">
                  Durban - Umgeni Road
                </Card>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Search All Offices
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
