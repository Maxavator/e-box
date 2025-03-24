
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Award, FileText, Calendar, User, Users, Wheelchair } from "lucide-react";

interface GrantCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

const GrantCard = ({ icon, title, description, action }: GrantCardProps) => {
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

export const SassaSection = () => {
  return (
    <div>
      <Card className="bg-orange-50 border-orange-200 mb-6">
        <div className="flex items-start p-6">
          <Award className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2">South African Social Security Agency (SASSA)</h2>
            <p className="text-muted-foreground">
              SASSA ensures the provision of social assistance to eligible South African citizens and residents. Apply for grants and check your application status.
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-amber-600 mr-2" />
          <p className="text-sm font-medium">
            SRD R350 Grant applications are open for the 2024/2025 financial year. Apply before 30 June 2024.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GrantCard
          icon={<Award className="h-6 w-6 text-primary" />}
          title="Social Grant Applications"
          description="Apply for various SASSA social grants online"
          action="Apply Now"
        />
        
        <GrantCard
          icon={<FileText className="h-6 w-6 text-primary" />}
          title="Application Status"
          description="Check the status of your SASSA application"
          action="Check Status"
        />
        
        <GrantCard
          icon={<Calendar className="h-6 w-6 text-primary" />}
          title="SRD R350 Grant"
          description="Apply for the COVID-19 Social Relief of Distress Grant"
          action="Apply Now"
        />
      </div>

      <h3 className="text-xl font-semibold mb-4">Available Grants</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <User className="h-6 w-6 text-primary mr-3" />
            <div>
              <h4 className="font-semibold">Older Persons Grant</h4>
              <p className="text-sm text-muted-foreground">Apply for grant for persons over 60 years</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Apply Now</Button>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <Users className="h-6 w-6 text-primary mr-3" />
            <div>
              <h4 className="font-semibold">Child Support Grant</h4>
              <p className="text-sm text-muted-foreground">Apply for assistance for primary caregivers of children</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Apply Now</Button>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <Wheelchair className="h-6 w-6 text-primary mr-3" />
            <div>
              <h4 className="font-semibold">Disability Grant</h4>
              <p className="text-sm text-muted-foreground">Apply for grant for persons with disabilities</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">Apply Now</Button>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Requirements & Documents</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>South African ID document (original)</li>
            <li>Proof of residence not older than 3 months</li>
            <li>Proof of income or bank statements (3 months)</li>
            <li>For disability grants: Medical assessment report</li>
            <li>For child grants: Birth certificate of the child</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
