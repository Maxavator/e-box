
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, ExternalLink } from "lucide-react";
import { SASSA_WEBSITE } from "../constants";

export const FAQsTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
