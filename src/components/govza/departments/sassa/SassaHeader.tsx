
import { Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SASSA_WEBSITE } from "./constants";

export const SassaHeader = () => {
  return (
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
  );
};
