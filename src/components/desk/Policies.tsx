
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Briefcase, Shield, Gavel, Scale } from "lucide-react";

export function Policies() {
  const policies = [
    {
      id: 1,
      category: "employment",
      title: "Basic Conditions of Employment Act",
      description: "Establishes minimum employment standards including working hours, leave, and termination.",
      icon: Briefcase,
      reference: "Act 75 of 1997",
      link: "https://www.gov.za/documents/basic-conditions-employment-act",
    },
    {
      id: 2,
      category: "employment",
      title: "Labour Relations Act",
      description: "Regulates collective bargaining, trade unions, and dispute resolution in the workplace.",
      icon: Scale,
      reference: "Act 66 of 1995",
      link: "https://www.gov.za/documents/labour-relations-act",
    },
    {
      id: 3,
      category: "protection",
      title: "Employment Equity Act",
      description: "Promotes equal opportunity and fair treatment in employment through elimination of unfair discrimination.",
      icon: Shield,
      reference: "Act 55 of 1998",
      link: "https://www.gov.za/documents/employment-equity-act",
    },
    {
      id: 4,
      category: "protection",
      title: "Occupational Health and Safety Act",
      description: "Provides for the health and safety of persons at work and in connection with the use of plant and machinery.",
      icon: Shield,
      reference: "Act 85 of 1993",
      link: "https://www.gov.za/documents/occupational-health-and-safety-act",
    },
    {
      id: 5,
      category: "benefits",
      title: "Unemployment Insurance Act",
      description: "Provides for the payment of unemployment insurance benefits to workers who lose their jobs.",
      icon: Gavel,
      reference: "Act 63 of 2001",
      link: "https://www.gov.za/documents/unemployment-insurance-act",
    },
    {
      id: 6,
      category: "benefits",
      title: "Compensation for Occupational Injuries and Diseases Act",
      description: "Provides for compensation for disablement caused by occupational injuries or diseases.",
      icon: Book,
      reference: "Act 130 of 1993",
      link: "https://www.gov.za/documents/compensation-occupational-injuries-and-diseases-act",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Labour Policies & Acts</h2>
      
      <Tabs defaultValue="employment" className="space-y-6">
        <TabsList className="bg-white">
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        {["employment", "protection", "benefits"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies
                  .filter((policy) => policy.category === category)
                  .map((policy) => (
                    <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-600/10">
                          <policy.icon className="h-5 w-5 text-brand-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{policy.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{policy.reference}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{policy.description}</p>
                        <a
                          href={policy.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-600 hover:underline inline-flex items-center gap-1"
                        >
                          View full act <span className="text-xs">↗</span>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
