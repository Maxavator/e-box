
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, Calculator, FileCheck, ExternalLink } from "lucide-react";

interface TaxServiceCardProps {
  title: string;
  description: string;
  status?: string;
  deadline: string;
}

const TaxServiceCard = ({ title, description, status, deadline }: TaxServiceCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="font-semibold flex items-center">
          {title}
          {status && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {status}
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="p-4 mt-auto border-t">
        <div className="flex justify-between mb-4 text-sm">
          <span className="text-muted-foreground">Deadline:</span>
          <span className="font-medium">{deadline}</span>
        </div>
        <Button variant="default" className="w-full">Access Service</Button>
      </div>
    </Card>
  );
};

interface DocumentCardProps {
  title: string;
  fileSize: string;
  fileType: string;
}

const DocumentCard = ({ title, fileSize, fileType }: DocumentCardProps) => {
  return (
    <Card className="p-4 hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">{title}</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{fileType}</span>
          <span className="text-xs text-muted-foreground">{fileSize}</span>
          <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const SarsSection = () => {
  return (
    <div>
      <Card className="bg-orange-50 border-orange-200 mb-6">
        <div className="flex items-start p-6">
          <FileText className="h-8 w-8 text-orange-500 mr-4 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2">South African Revenue Service</h2>
            <p className="text-muted-foreground">
              Tax filing, customs, and excise services for individuals and businesses
            </p>
          </div>
        </div>
      </Card>

      <Card className="bg-amber-50 border-amber-200 p-4 mb-6">
        <div className="flex items-center">
          <CalendarDays className="h-5 w-5 text-amber-600 mr-2" />
          <p className="text-sm font-medium">
            2024 Tax Season Notice: The 2024 tax filing season for individuals is now open. Deadline for non-provisional taxpayers: 15 November 2024. Provisional taxpayers: 31 January 2025.
          </p>
        </div>
      </Card>

      <Tabs defaultValue="individuals" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="individuals">Individuals</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="customs">Customs & Excise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individuals">
          <h3 className="text-lg font-semibold mb-4">Personal Tax Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaxServiceCard
              title="File Income Tax Return (ITR12)"
              description="Submit your annual personal income tax return"
              status="Open"
              deadline="15 November 2024"
            />
            
            <TaxServiceCard
              title="Tax Calculator"
              description="Estimate your tax liability and potential refund"
              status="Available"
              deadline="N/A"
            />
            
            <TaxServiceCard
              title="Tax Registration"
              description="Register for income tax as an individual"
              status="Available"
              deadline="N/A"
            />
            
            <TaxServiceCard
              title="Tax Compliance Status"
              description="Check your current tax compliance status"
              status="Available"
              deadline="N/A"
            />
          </div>
          
          <h3 className="text-lg font-semibold mt-8 mb-4">Forms & Documents</h3>
          <div className="space-y-2">
            <DocumentCard
              title="IT-AE-41-G01 - Guide for completion and submission of ITR12 return"
              fileSize="1.2 MB"
              fileType="PDF"
            />
            
            <DocumentCard
              title="IT-GEN-06-G01 - Guide to the Individual ITR12 tax return for deceased and insolvent estates"
              fileSize="980 KB"
              fileType="PDF"
            />
            
            <DocumentCard
              title="IT-GEN-02-G01 - How to submit a Return via eFiling"
              fileSize="1.5 MB"
              fileType="PDF"
            />
            
            <DocumentCard
              title="IT-AE-36-G04 - Auto Assessment guide for Individuals via eFiling"
              fileSize="860 KB"
              fileType="PDF"
            />
          </div>
          
          <Button variant="outline" className="mt-4 w-full">
            View All Documents
          </Button>
          
          <h3 className="text-lg font-semibold mt-8 mb-4">SARS Online Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">SARS eFiling</h4>
                  <p className="text-sm text-muted-foreground">Submit returns, make payments, and manage your tax affairs online</p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">SARS MobiApp</h4>
                  <p className="text-sm text-muted-foreground">Access tax services on your mobile device</p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">E@syFile™</h4>
                  <p className="text-sm text-muted-foreground">Software for employers to submit PAYE, UIF and SDL returns</p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">SARS Contact Center</h4>
                  <p className="text-sm text-muted-foreground">Get assistance with tax-related queries and issues</p>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="businesses">
          <h3 className="text-lg font-semibold mb-4">Business Tax Services</h3>
          <p className="text-muted-foreground mb-4">
            Tax services for companies, small businesses, and other legal entities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business tax service cards would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="customs">
          <h3 className="text-lg font-semibold mb-4">Customs & Excise Services</h3>
          <p className="text-muted-foreground mb-4">
            Services related to customs duties, import/export, and excise taxes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customs and excise service cards would go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
