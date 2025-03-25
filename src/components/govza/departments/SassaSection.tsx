
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  FileText, 
  Calendar, 
  User, 
  Users, 
  Accessibility, 
  ExternalLink,
  Phone,
  Mail,
  Clock,
  MapPin,
  AlertCircle,
  HelpCircle,
  Wallet
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const SASSA_WEBSITE = "https://www.sassa.gov.za";

interface GrantCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
}

const GrantCard = ({ icon, title, description, action, link }: GrantCardProps) => {
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

export const SassaSection = () => {
  return (
    <div>
      <Card className="bg-orange-50 border-orange-200 mb-6">
        <div className="flex items-start p-6">
          <Award className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold">South African Social Security Agency (SASSA)</h2>
              <Badge variant="outline" className="text-xs">Official Service</Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              SASSA ensures the provision of social assistance to eligible South African citizens and residents. Apply for grants, check your application status, and manage your social security benefits.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.open(SASSA_WEBSITE, "_blank")}
            >
              Visit Official Website <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">
              Social Relief of Distress (SRD) R350 Grant applications are open for the 2024/2025 financial year. Apply before 30 June 2024.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Check the official SASSA website for the latest updates on grant payment dates.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="grants" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grants" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GrantCard
              icon={<Award className="h-6 w-6 text-primary" />}
              title="Social Grant Applications"
              description="Apply for various SASSA social grants online or find your nearest office."
              action="Apply Now"
              link={`${SASSA_WEBSITE}/Services/social-grants`}
            />
            
            <GrantCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Application Status"
              description="Check the status of your SASSA grant application or payment."
              action="Check Status"
              link={`${SASSA_WEBSITE}/Services/status-check`}
            />
            
            <GrantCard
              icon={<Wallet className="h-6 w-6 text-primary" />}
              title="SRD R350 Grant"
              description="Apply for the COVID-19 Social Relief of Distress Grant of R350 per month."
              action="Apply Now"
              link="https://srd.sassa.gov.za"
            />
          </div>
          
          <h3 className="text-xl font-semibold mt-8 mb-4">Available Grants</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <User className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Older Persons Grant</h4>
                  <p className="text-sm text-muted-foreground">For persons over 60 years of age</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Services/older-persons-grant`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <Users className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Child Support Grant</h4>
                  <p className="text-sm text-muted-foreground">For primary caregivers of children under 18</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Services/child-support-grant`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <Accessibility className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Disability Grant</h4>
                  <p className="text-sm text-muted-foreground">For persons with physical or mental disabilities</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Services/disability-grant`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Application Process</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <FileText className="inline mr-2 h-5 w-5 text-primary" /> Application Methods
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    <span className="font-medium">In Person:</span> Visit your nearest SASSA office with all required documents
                  </li>
                  <li>
                    <span className="font-medium">Online:</span> SRD grants can be applied for online at <a href="https://srd.sassa.gov.za" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">srd.sassa.gov.za</a>
                  </li>
                  <li>
                    <span className="font-medium">Mobile Units:</span> SASSA mobile units visit remote areas on scheduled dates
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <Calendar className="inline mr-2 h-5 w-5 text-primary" /> Application Timeline
                </h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Processing time: 3-90 days depending on grant type</li>
                  <li>First payment: Usually within 30 days of approval</li>
                  <li>SRD Grant processing: 2-4 weeks</li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Services/how-to-apply`, "_blank")}
              >
                Detailed Application Guide <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-5 border-amber-200 bg-amber-50">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Required Documents</h3>
                <ul className="space-y-1 text-sm">
                  <li>South African ID document (original)</li>
                  <li>Proof of residence not older than 3 months</li>
                  <li>Proof of income or bank statements (3 months)</li>
                  <li>For disability grants: Medical assessment report</li>
                  <li>For child grants: Birth certificate of the child</li>
                  <li>Proof of marital status (if applicable)</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="eligibility" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Grant Eligibility Requirements</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Older Persons Grant</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>South African citizen, permanent resident, or refugee</li>
                  <li>60 years of age or older</li>
                  <li>Not receiving another social grant for yourself</li>
                  <li>Not living in a state institution</li>
                  <li>Income threshold: Single: R86,280 per year | Married: R172,560 per year combined</li>
                  <li>Assets threshold: Single: R1,227,600 | Married: R2,455,200 combined</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Child Support Grant</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Primary caregiver of child/children under 18</li>
                  <li>South African citizen, permanent resident, or refugee</li>
                  <li>Income threshold: Single: R54,000 per year | Married: R108,000 per year combined</li>
                  <li>Child must reside with the primary caregiver</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Disability Grant</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>South African citizen, permanent resident, or refugee</li>
                  <li>Between 18 and 59 years of age</li>
                  <li>Medical assessment confirming disability</li>
                  <li>Income threshold: Single: R86,280 per year | Married: R172,560 per year combined</li>
                  <li>Assets threshold: Single: R1,227,600 | Married: R2,455,200 combined</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Social Relief of Distress (R350) Grant</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>South African citizen, permanent resident, or refugee</li>
                  <li>18 years of age or older</li>
                  <li>Unemployed with no income</li>
                  <li>Not receiving any other social grant or UIF payments</li>
                  <li>Not supported by any institution</li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Services/grant-requirements`, "_blank")}
              >
                Full Eligibility Details <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> How do I find my nearest SASSA office?
                </h4>
                <p className="text-sm text-muted-foreground">
                  You can use the SASSA office locator on the official website by entering your province and district. 
                  Alternatively, you can call the SASSA toll-free number at 0800 60 10 11 for directions to your nearest office.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> When are SASSA grants paid each month?
                </h4>
                <p className="text-sm text-muted-foreground">
                  SASSA publishes a payment schedule every month. Generally, Older Persons Grants are paid first, 
                  followed by Disability Grants, and then Child Support and other grants. Payment dates can be 
                  checked on the SASSA website or social media channels.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> Can I apply for more than one grant?
                </h4>
                <p className="text-sm text-muted-foreground">
                  You cannot receive more than one social grant for yourself, but you can receive a grant for 
                  yourself (e.g., Old Age Grant) and also receive grants on behalf of children in your care 
                  (e.g., Child Support Grant or Foster Child Grant).
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> What happens if my SASSA card is lost or stolen?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Report your lost or stolen SASSA card immediately by calling the SASSA Card Hotline at 
                  0800 60 10 11. You can also visit your nearest SASSA office with your ID to apply for a 
                  replacement card. A temporary card may be issued while waiting for the new one.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> Do I need to reapply for my grant every year?
                </h4>
                <p className="text-sm text-muted-foreground">
                  No, most grants continue automatically once approved. However, some grants like the Disability Grant 
                  may require periodic reassessment. The SRD R350 Grant requires reapplication for each new phase 
                  of the program as announced by the government.
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Services/frequently-asked-questions`, "_blank")}
              >
                View All FAQs <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Contact SASSA</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h4 className="font-medium">Toll-Free Call Center</h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:0800601011" className="text-primary hover:underline">0800 60 10 11</a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monday to Friday: 08:00 - 16:00
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Email Support</h4>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:grantsenquiries@sassa.gov.za" className="text-primary hover:underline">grantsenquiries@sassa.gov.za</a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Response time: 2-3 business days
                </p>
              </div>
            </div>
            
            <Separator className="my-5" />
            
            <div className="space-y-3">
              <h4 className="font-medium">Head Office</h4>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  SASSA House<br />
                  501 Prodinsa Building<br />
                  Cnr Steve Biko & Pretorius Street<br />
                  Pretoria<br />
                  0001
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${SASSA_WEBSITE}/Contact-Us`, "_blank")}
              >
                All Contact Details <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-5 border-blue-200 bg-blue-50">
            <div className="flex gap-4">
              <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Regional Offices</h3>
                <p className="text-sm">
                  SASSA has offices in all nine provinces of South Africa. Find your nearest office for in-person assistance.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(`${SASSA_WEBSITE}/Contact-Us/Regional-Offices`, "_blank")}
                >
                  Find Regional Offices <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-5 border-green-200 bg-green-50">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Report Fraud</h3>
                <p className="text-sm">
                  Report any suspected fraud, corruption, or misuse of SASSA grants through the dedicated hotline.
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <a href="tel:0800601011" className="text-green-700 font-medium hover:underline">0800 60 10 11</a>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
