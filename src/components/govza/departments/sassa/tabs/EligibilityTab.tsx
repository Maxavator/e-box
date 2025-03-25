
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SASSA_WEBSITE } from "../constants";

export const EligibilityTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
