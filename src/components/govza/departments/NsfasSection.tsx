
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  FileText, 
  Calendar, 
  School,
  Book,
  Award
} from "lucide-react";

interface FundingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

const FundingCard = ({ icon, title, description, action }: FundingCardProps) => {
  return (
    <Card className="h-full flex flex-col p-6">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button variant="default" className="w-full">
        {action}
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
            <h2 className="text-xl font-semibold mb-2">National Student Financial Aid Scheme (NSFAS)</h2>
            <p className="text-muted-foreground">
              NSFAS provides financial aid to eligible students at public universities and TVET colleges. Apply for funding, check your application status, and manage your student account.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-green-50 border-green-200 p-4 mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-sm font-medium">
            Applications for 2025 academic year funding are now open. Apply before 30 November 2024.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FundingCard
          icon={<School className="h-6 w-6 text-primary" />}
          title="Student Funding Applications"
          description="Apply for NSFAS funding for universities and TVET colleges"
          action="Apply Now"
        />
        
        <FundingCard
          icon={<FileText className="h-6 w-6 text-primary" />}
          title="Application Status"
          description="Check the status of your NSFAS application"
          action="Check Status"
        />
        
        <FundingCard
          icon={<Book className="h-6 w-6 text-primary" />}
          title="Student Portal Login"
          description="Access your NSFAS student account portal"
          action="Login"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">Funding Categories</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <School className="h-6 w-6 text-primary mr-3" />
            <div>
              <h4 className="font-semibold">University Studies</h4>
              <p className="text-sm text-muted-foreground">Funding for undergraduate qualifications at public universities</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Learn More</Button>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <Book className="h-6 w-6 text-primary mr-3" />
            <div>
              <h4 className="font-semibold">TVET College</h4>
              <p className="text-sm text-muted-foreground">Funding for diplomas and certificates at TVET colleges</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Learn More</Button>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <Award className="h-6 w-6 text-primary mr-3" />
            <div>
              <h4 className="font-semibold">Bursaries & Scholarships</h4>
              <p className="text-sm text-muted-foreground">Special funding opportunities and scholarships</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Learn More</Button>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Requirements & Documents</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>South African ID document (original)</li>
            <li>Proof of income (parents/guardian/spouse)</li>
            <li>Latest academic results or National Senior Certificate</li>
            <li>Proof of residence not older than 3 months</li>
            <li>Acceptance letter from a public higher education institution</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
