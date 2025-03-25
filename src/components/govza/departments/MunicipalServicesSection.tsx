
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  PencilRuler, 
  ExternalLink,
  Phone,
  Mail,
  Clock,
  MapPin,
  AlertCircle,
  HelpCircle,
  Wallet,
  Droplets,
  Lightbulb,
  Trash2,
  Home,
  Search
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, action, link }: ServiceCardProps) => {
  return (
    <Card className="h-full flex flex-col p-6 hover:shadow-md transition-shadow">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button 
        variant="default" 
        className="w-full gap-2" 
        onClick={() => window.open(link, "_blank")}
      >
        {action} <ExternalLink className="h-4 w-4" />
      </Button>
    </Card>
  );
};

export const MunicipalServicesSection = () => {
  const [selectedCity, setSelectedCity] = useState("johannesburg");
  const [searchQuery, setSearchQuery] = useState("");
  
  const cityWebsites = {
    johannesburg: "https://www.joburg.org.za",
    capetown: "https://www.capetown.gov.za",
    durban: "https://www.durban.gov.za",
    tshwane: "https://www.tshwane.gov.za",
    ekurhuleni: "https://www.ekurhuleni.gov.za"
  };
  
  const getCityWebsite = () => {
    return cityWebsites[selectedCity as keyof typeof cityWebsites];
  };

  return (
    <div>
      <Card className="bg-blue-50 border-blue-200 mb-6">
        <div className="flex items-start p-6">
          <Building2 className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold">Municipal Services</h2>
              <Badge variant="outline" className="text-xs">Local Government</Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              Access essential municipal services, pay bills, report issues, and find information about local government initiatives in your area.
            </p>
            <div className="mb-4">
              <label htmlFor="city-select" className="block text-sm font-medium mb-1">Select your municipality:</label>
              <select 
                id="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white border rounded-md p-2 w-full md:w-auto"
              >
                <option value="johannesburg">City of Johannesburg</option>
                <option value="capetown">City of Cape Town</option>
                <option value="durban">eThekwini Municipality (Durban)</option>
                <option value="tshwane">City of Tshwane (Pretoria)</option>
                <option value="ekurhuleni">City of Ekurhuleni</option>
              </select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.open(getCityWebsite(), "_blank")}
            >
              Visit Official Website <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">
              Load shedding schedules are now available for all major municipalities. Check your local schedule to plan accordingly.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for municipal services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90">
          Search
        </Button>
      </div>

      <Tabs defaultValue="services" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="reporting">Issue Reporting</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              icon={<Droplets className="h-6 w-6 text-primary" />}
              title="Water Services"
              description="Apply for water connections, report water leaks, and manage your water account."
              action="Access Services"
              link={`${getCityWebsite()}/water`}
            />
            
            <ServiceCard
              icon={<Lightbulb className="h-6 w-6 text-primary" />}
              title="Electricity Services"
              description="Apply for electricity connections, report outages, and check load shedding schedules."
              action="Access Services"
              link={`${getCityWebsite()}/electricity`}
            />
            
            <ServiceCard
              icon={<Trash2 className="h-6 w-6 text-primary" />}
              title="Waste Management"
              description="Find collection schedules, recycling information, and report illegal dumping."
              action="Access Services"
              link={`${getCityWebsite()}/waste`}
            />
          </div>
          
          <h3 className="text-xl font-semibold mt-8 mb-4">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <Home className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Housing Services</h4>
                  <p className="text-sm text-muted-foreground">Social housing and subsidies</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${getCityWebsite()}/housing`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <PencilRuler className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Building Plans</h4>
                  <p className="text-sm text-muted-foreground">Submissions and approvals</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${getCityWebsite()}/planning`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <FileText className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Municipal Forms</h4>
                  <p className="text-sm text-muted-foreground">Download and submit municipal forms</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${getCityWebsite()}/forms`, "_blank")}
              >
                Access Forms <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bills" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Bills and Payments</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <Wallet className="inline mr-2 h-5 w-5 text-primary" /> Payment Methods
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Online Payments:</span> Pay your municipal bills securely online
                  </li>
                  <li>
                    <span className="font-medium">EFT:</span> Make payments via electronic funds transfer
                  </li>
                  <li>
                    <span className="font-medium">In Person:</span> Visit your nearest municipal customer care center
                  </li>
                  <li>
                    <span className="font-medium">Debit Order:</span> Set up automatic monthly payments
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <FileText className="inline mr-2 h-5 w-5 text-primary" /> Billing Information
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>View and download your municipal account statements</li>
                  <li>Query your account balance and payment history</li>
                  <li>Update your account details and contact information</li>
                  <li>Apply for indigent subsidies if you qualify</li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${getCityWebsite()}/payments`, "_blank")}
              >
                Pay Municipal Bills <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-5 border-green-200 bg-green-50">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Account Queries</h3>
                <p className="text-sm">
                  If you have queries about your municipal account, contact the billing department at your local municipality.
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <a href="tel:0860543543" className="text-green-700 font-medium hover:underline">0860 543 543</a>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="property" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Property Information</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Property Valuations</h4>
                <p className="text-sm mb-3">
                  Property valuations are conducted every 4 years to determine rates and taxes. 
                  You can check your property valuation and lodge objections during the objection period.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/valuations`, "_blank")}
                >
                  Check Property Valuation <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Building Plans and Land Use</h4>
                <p className="text-sm mb-3">
                  Submit building plans, rezoning applications, and check zoning certificates online. 
                  View land use maps and development plans for your area.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/planning`, "_blank")}
                >
                  Building Plans Portal <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Property Transfers</h4>
                <p className="text-sm mb-3">
                  Information about transferring property ownership, clearance certificates, 
                  and required documentation for property transactions.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/property-transfers`, "_blank")}
                >
                  Transfer Information <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Report Municipal Issues</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Infrastructure Issues</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Potholes and road damage</li>
                  <li>Water leaks and sewage spills</li>
                  <li>Street light outages</li>
                  <li>Damaged traffic signals</li>
                  <li>Blocked storm water drains</li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/report-issue`, "_blank")}
                >
                  Report Infrastructure Issue <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Service Delivery Issues</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Missed waste collection</li>
                  <li>Electricity supply problems</li>
                  <li>Water supply interruptions</li>
                  <li>Illegal dumping</li>
                  <li>Public space maintenance</li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/service-issues`, "_blank")}
                >
                  Report Service Issue <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md mt-4 border border-blue-200">
              <h4 className="font-medium mb-2 flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-2" /> 24/7 Emergency Contact
              </h4>
              <p className="text-sm mb-2">
                For urgent issues that require immediate attention, contact the municipal emergency line:
              </p>
              <div className="flex items-center justify-center gap-4 py-2">
                <a href="tel:0860543543" className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-blue-200 hover:bg-blue-50">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="font-bold">0860 543 543</span>
                </a>
              </div>
            </div>
          </Card>
          
          <Card className="p-5 border-amber-200 bg-amber-50">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Track Your Reports</h3>
                <p className="text-sm">
                  You can track the status of your reported issues using the reference number provided when you submitted the report.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/track-report`, "_blank")}
                >
                  Track Report Status <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Contact Municipal Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h4 className="font-medium">Customer Care Call Center</h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:0860543543" className="text-primary hover:underline">0860 543 543</a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monday to Friday: 07:30 - 16:30<br />
                  Saturday: 08:00 - 12:30
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Email Support</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:customercare@municipality.gov.za" className="text-primary hover:underline">customercare@municipality.gov.za</a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Response time: 2-3 business days
                </p>
              </div>
            </div>
            
            <Separator className="my-5" />
            
            <div className="space-y-3">
              <h4 className="font-medium">Municipal Customer Care Centers</h4>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Visit your nearest municipal customer care center for in-person assistance.
                  Service centers are typically open Monday to Friday, 08:00 - 15:30.
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${getCityWebsite()}/customer-care-centers`, "_blank")}
              >
                Find Customer Care Centers <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-5 border-blue-200 bg-blue-50">
            <div className="flex gap-4">
              <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-sm">
                  Municipal offices are open Monday to Friday from 08:00 to 15:30, excluding public holidays.
                  Some services may have different operating hours.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/contact-us`, "_blank")}
                >
                  View All Contact Details <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-5 border-green-200 bg-green-50">
            <div className="flex gap-4">
              <HelpCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Frequently Asked Questions</h3>
                <p className="text-sm">
                  Find answers to commonly asked questions about municipal services, billing, and more.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(`${getCityWebsite()}/faqs`, "_blank")}
                >
                  View FAQs <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
