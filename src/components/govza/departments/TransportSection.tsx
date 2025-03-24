
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Car, Info, FileText, Clock } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  fee: string;
  location: string;
}

const ServiceCard = ({ icon, title, description, fee, location }: ServiceCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-start mb-3">
          {icon}
          <div className="ml-3">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4 text-sm border-t">
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Fee:</span>
          <span className="font-medium">{fee}</span>
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

export const TransportSection = () => {
  return (
    <div>
      <Card className="bg-orange-50 border-orange-200 mb-6">
        <div className="flex items-start p-6">
          <Car className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Department of Transport</h2>
            <p className="text-muted-foreground">
              Driver's licenses, vehicle registration, license renewals and public transport information
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-sm font-medium">
            License Renewals Extension: The grace period for driver's license renewals has been extended to 31 August 2024 for licenses that expired between January 2023 and June 2024.
          </p>
        </div>
      </Card>

      <Tabs defaultValue="drivers-licenses" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="drivers-licenses">Driver's Licenses</TabsTrigger>
          <TabsTrigger value="vehicle-registration">Vehicle Registration</TabsTrigger>
          <TabsTrigger value="public-transport">Public Transport</TabsTrigger>
        </TabsList>
        
        <TabsContent value="drivers-licenses">
          <h3 className="text-lg font-semibold mb-4">Driver's License Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Driver's License Renewal"
              description="Renew your existing driver's license"
              fee="R250"
              location="All Driving License Testing Centers (DLTCs)"
            />
            
            <ServiceCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Learner's License Application"
              description="Apply for a new learner's license"
              fee="R150"
              location="All Driving License Testing Centers (DLTCs)"
            />
            
            <ServiceCard
              icon={<Car className="h-6 w-6 text-primary" />}
              title="Driver's License Test Booking"
              description="Book a driving test for a new license"
              fee="R350"
              location="All Driving License Testing Centers (DLTCs)"
            />
            
            <ServiceCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Professional Driving Permit (PrDP)"
              description="Apply for or renew a professional driving permit"
              fee="R300"
              location="Select Driving License Testing Centers"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="vehicle-registration">
          <h3 className="text-lg font-semibold mb-4">Vehicle Registration Services</h3>
          <p className="text-muted-foreground mb-4">
            Services related to vehicle registration and licensing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle registration service cards would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="public-transport">
          <h3 className="text-lg font-semibold mb-4">Public Transport Services</h3>
          <p className="text-muted-foreground mb-4">
            Information and services related to public transportation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public transport service cards would go here */}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Requirements & Documents</h3>
        <Card className="p-6">
          <h4 className="font-medium mb-3">License Renewal Requirements</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Original ID document and a copy</li>
            <li>Two recent passport photographs</li>
            <li>Proof of residence not older than 3 months</li>
            <li>Old driver's license card or valid temporary driver's license</li>
            <li>Proof of payment for license renewal</li>
            <li>Completed application form (DL1)</li>
          </ul>
          
          <h4 className="font-medium mt-6 mb-3">License Renewal Process</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Complete the DL1 form at your nearest DLTC</li>
            <li>Submit all required documents</li>
            <li>Pay the license renewal fee</li>
            <li>Undergo eye testing at the DLTC</li>
            <li>Have your fingerprints taken</li>
            <li>Collect your temporary driver's license</li>
            <li>Receive SMS when new card is ready for collection (4-6 weeks)</li>
          </ol>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Find a Testing or Licensing Center</h3>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg p-6 flex items-center justify-center text-muted-foreground">
              Map will display here
            </div>
            <div>
              <h4 className="font-medium mb-2">Nearby Centers</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Find vehicle testing stations, driver's license testing centers, and vehicle licensing departments near you.
              </p>
              <Button variant="outline" className="w-full">
                Find Centers
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
