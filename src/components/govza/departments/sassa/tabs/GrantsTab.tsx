
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  FileText, 
  User, 
  Users, 
  Accessibility, 
  ExternalLink,
  Wallet
} from "lucide-react";
import { GrantCard } from "../GrantCard";
import { SASSA_WEBSITE } from "../constants";

export const GrantsTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
