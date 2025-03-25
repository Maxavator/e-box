
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  AlertCircle, 
  ExternalLink 
} from "lucide-react";
import { SASSA_WEBSITE } from "../constants";

export const ContactTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
