
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  FileText, 
  Calendar, 
  School,
  Book,
  Award,
  ExternalLink,
  Clock,
  AlertCircle,
  Phone,
  HelpCircle,
  Calculator
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const NSFAS_WEBSITE = "https://www.nsfas.org.za";

interface FundingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
}

const FundingCard = ({ icon, title, description, action, link }: FundingCardProps) => {
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

export const NsfasSection = () => {
  return (
    <div>
      <Card className="bg-blue-50 border-blue-200 mb-6">
        <div className="flex items-start p-6">
          <GraduationCap className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold">National Student Financial Aid Scheme (NSFAS)</h2>
              <Badge variant="outline" className="text-xs">Official Service</Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              NSFAS provides financial aid to eligible students at public universities and TVET colleges. Apply for funding, check your application status, and manage your student account.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => window.open(NSFAS_WEBSITE, "_blank")}
            >
              Visit Official Website <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-green-50 border-green-200 p-4 mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">
              Applications for 2025 academic year funding are now open. Apply before 30 November 2024.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              First-time applicants and returning students need to apply/re-apply each year.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="apply" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="apply">Apply</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="apply" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FundingCard
              icon={<School className="h-6 w-6 text-primary" />}
              title="Student Funding Applications"
              description="Apply for NSFAS funding for universities and TVET colleges. New applications and renewals."
              action="Apply Now"
              link={`${NSFAS_WEBSITE}/students/apply/`}
            />
            
            <FundingCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Application Status"
              description="Check the status of your NSFAS application or track your funding."
              action="Check Status"
              link={`${NSFAS_WEBSITE}/students/myapplication/status/`}
            />
            
            <FundingCard
              icon={<Book className="h-6 w-6 text-primary" />}
              title="Student Portal Login"
              description="Access your NSFAS student account portal to manage your funding."
              action="Login"
              link={`${NSFAS_WEBSITE}/students/login/`}
            />
          </div>
          
          <Card className="p-5 border-amber-200 bg-amber-50">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">Important Information for Applicants</h3>
                <ul className="space-y-1 text-sm">
                  <li>Applications are submitted online - no paper applications accepted</li>
                  <li>Have your South African ID and academic results ready when applying</li>
                  <li>Parents/guardians must provide consent for SARS income verification</li>
                  <li>All communication happens via the myNSFAS portal - check regularly</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="eligibility" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">NSFAS Eligibility Requirements</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <School className="inline mr-2 h-5 w-5 text-primary" /> Academic Requirements
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>South African citizen</li>
                  <li>Accepted at a public university or TVET college</li>
                  <li>First undergraduate qualification (some exceptions apply)</li>
                  <li>Meet academic performance requirements for continued funding</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <Calculator className="inline mr-2 h-5 w-5 text-primary" /> Financial Requirements
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Combined household income below R350,000 per year</li>
                  <li>SASSA grant recipients automatically qualify for financial consideration</li>
                  <li>Financial need determined through NSFAS means test</li>
                </ul>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${NSFAS_WEBSITE}/students/eligibility/`, "_blank")}
              >
                Full Eligibility Details <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <School className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">University Studies</h4>
                  <p className="text-sm text-muted-foreground">Funding for undergraduate qualifications at public universities</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${NSFAS_WEBSITE}/students/university-funding/`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <Book className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">TVET College</h4>
                  <p className="text-sm text-muted-foreground">Funding for diplomas and certificates at TVET colleges</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${NSFAS_WEBSITE}/students/tvet-funding/`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
            
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start mb-3">
                <Award className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Bursaries & Scholarships</h4>
                  <p className="text-sm text-muted-foreground">Special funding opportunities and scholarships</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open(`${NSFAS_WEBSITE}/students/bursaries/`, "_blank")}
              >
                Learn More <ExternalLink className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> How long does the application process take?
                </h4>
                <p className="text-sm text-muted-foreground">
                  The standard processing time is 4-6 weeks after submission. During peak periods (November to January), 
                  it may take longer. Check your myNSFAS portal regularly for updates.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> What costs does NSFAS cover?
                </h4>
                <p className="text-sm text-muted-foreground">
                  NSFAS covers tuition fees, accommodation (or travel allowance), book allowance, and in some cases, a meal allowance. 
                  The coverage depends on your institution and study program.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> Do I need to reapply every year?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Yes, all students need to reapply for NSFAS funding each academic year. Continued funding depends on academic 
                  performance and continued financial need.
                </p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="font-medium flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 mr-2 text-primary" /> What if my application is rejected?
                </h4>
                <p className="text-sm text-muted-foreground">
                  You can appeal the decision through the myNSFAS portal within 30 days of receiving the outcome. 
                  You will need to provide additional supporting documentation for your appeal.
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${NSFAS_WEBSITE}/faqs/`, "_blank")}
              >
                View All FAQs <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-4">Contact NSFAS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h4 className="font-medium">Call Center</h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:0800067327" className="text-primary hover:underline">0800 067 327</a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monday to Friday: 08:30 - 17:00
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Email Support</h4>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <a href="mailto:info@nsfas.org.za" className="text-primary hover:underline">info@nsfas.org.za</a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Response time: 2-3 business days
                </p>
              </div>
            </div>
            
            <Separator className="my-5" />
            
            <div className="space-y-3">
              <h4 className="font-medium">Head Office</h4>
              <p className="text-sm">
                10 Brodie Road, House Vincent<br />
                2nd Floor, Wynberg<br />
                Cape Town, 7800
              </p>
              
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => window.open(`${NSFAS_WEBSITE}/contact/`, "_blank")}
              >
                All Contact Details <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
          
          <Card className="p-5 border-blue-200 bg-blue-50">
            <div className="flex gap-4">
              <Clock className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold">NSFAS Walk-in Centers</h3>
                <p className="text-sm">
                  NSFAS has walk-in centers at various universities and TVET colleges during registration periods.
                  Check with your institution for on-campus NSFAS support services.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open(`${NSFAS_WEBSITE}/students/walkincenter/`, "_blank")}
                >
                  Find Walk-in Centers <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Required Documents</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>South African ID document (original)</li>
            <li>Proof of income (parents/guardian/spouse)</li>
            <li>Latest academic results or National Senior Certificate</li>
            <li>Proof of residence not older than 3 months</li>
            <li>Acceptance letter from a public higher education institution</li>
          </ul>
          
          <Button 
            variant="outline" 
            className="w-full mt-4 gap-2"
            onClick={() => window.open(`${NSFAS_WEBSITE}/students/applications-checklist/`, "_blank")}
          >
            Application Checklist <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
