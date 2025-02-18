
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoIcon } from "lucide-react";

export function LeaveInformation() {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-6">
        <InfoIcon className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Leave Entitlements</h2>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="annual">
            <AccordionTrigger className="text-lg font-medium">
              Annual Leave
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-gray-600">
              <p>21 consecutive days per year (15 working days)</p>
              <p>Accrual rate: 1.25 days per month worked</p>
              <p>Must be taken within 6 months of the end of the leave cycle</p>
              <a 
                href="https://www.labour.gov.za/annual-leave" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Official Documentation →
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sick">
            <AccordionTrigger className="text-lg font-medium">
              Sick Leave
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-gray-600">
              <p>30 days per 36-month cycle</p>
              <p>Medical certificate required for absences longer than 2 consecutive days</p>
              <p>Or if sick leave is taken more than twice in an 8-week period</p>
              <a 
                href="https://www.labour.gov.za/sick-leave" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Official Documentation →
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="maternity">
            <AccordionTrigger className="text-lg font-medium">
              Maternity Leave
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-gray-600">
              <p>4 consecutive months</p>
              <p>Can commence 4 weeks before expected date of birth</p>
              <p>May not work for 6 weeks after birth unless medically certified</p>
              <a 
                href="https://www.labour.gov.za/maternity-leave" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Official Documentation →
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="family">
            <AccordionTrigger className="text-lg font-medium">
              Family Responsibility Leave
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-gray-600">
              <p>3 days per year</p>
              <p>Available for birth, illness, or death of close family members</p>
              <p>Only applies to employees who have worked for more than 4 months</p>
              <a 
                href="https://www.labour.gov.za/family-responsibility-leave" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Official Documentation →
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Important Notice</h3>
          <p className="text-sm text-blue-600">
            These leave entitlements are based on the Basic Conditions of Employment Act (BCEA). 
            Specific company policies may provide additional benefits. Please refer to your 
            employment contract for detailed terms.
          </p>
        </div>
      </ScrollArea>
    </Card>
  );
}
