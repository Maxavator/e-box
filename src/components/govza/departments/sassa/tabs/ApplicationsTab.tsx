
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { SASSA_WEBSITE } from "../constants";

export const ApplicationsTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
