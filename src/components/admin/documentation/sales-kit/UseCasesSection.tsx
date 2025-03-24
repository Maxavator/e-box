
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BookOpen, Building, GraduationCap, Landmark, HeartPulse, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UseCaseProps {
  title: string;
  industry: string;
  organization: string;
  challenge: string;
  solution: string;
  results: string[];
  icon: React.ReactNode;
}

export function UseCasesSection() {
  const useCases: UseCaseProps[] = [
    {
      title: "Department of Public Service",
      industry: "Government",
      organization: "National Department of Public Service",
      challenge: "Needed to securely manage thousands of sensitive documents and streamline communication between multiple regional offices while ensuring POPIA compliance.",
      solution: "Implemented e-Box with custom workflows for document approval and department-specific access controls.",
      results: [
        "Reduced document processing time by 62%",
        "Eliminated paper-based workflows, saving R2.4M annually",
        "Achieved full POPIA compliance",
        "Improved interdepartmental collaboration"
      ],
      icon: <Building className="h-8 w-8 text-primary" />
    },
    {
      title: "University of Cape Town",
      industry: "Education",
      organization: "Major South African university",
      challenge: "Required a secure platform for faculty-student communication and document sharing that integrated with existing student management systems.",
      solution: "Deployed e-Box with custom API integrations to existing systems and role-based access for students, faculty, and administrators.",
      results: [
        "97% student adoption within first semester",
        "Reduced administrative overhead by 45%",
        "Centralized all student-faculty communications",
        "Simplified document submission and grading process"
      ],
      icon: <GraduationCap className="h-8 w-8 text-primary" />
    },
    {
      title: "Financial Services Provider",
      industry: "Financial",
      organization: "Leading South African bank",
      challenge: "Needed to securely distribute financial documents to clients while maintaining strict audit trails and regulatory compliance.",
      solution: "Implemented e-Box with OTP verification, enhanced security features, and customized client portal interface.",
      results: [
        "100% secure document delivery with verification",
        "Reduced document distribution costs by 78%",
        "Full compliance with financial regulations",
        "Improved client satisfaction scores by 32%"
      ],
      icon: <Landmark className="h-8 w-8 text-primary" />
    },
    {
      title: "National Healthcare System",
      industry: "Healthcare",
      organization: "Provincial healthcare authority",
      challenge: "Required secure sharing of patient information between facilities while maintaining strict POPIA compliance and accessibility.",
      solution: "Deployed e-Box with healthcare-specific security features, custom access controls, and integration with existing medical record systems.",
      results: [
        "Reduced patient transfer processing time by 54%",
        "Eliminated lost records and duplicated tests",
        "Maintained strict patient privacy compliance",
        "Improved continuity of care between facilities"
      ],
      icon: <HeartPulse className="h-8 w-8 text-primary" />
    },
    {
      title: "Legal Services Firm",
      industry: "Legal",
      organization: "Major corporate law practice",
      challenge: "Needed to securely manage client case files, ensure proper document retention, and maintain client confidentiality.",
      solution: "Implemented e-Box with custom case management features, advanced retention policies, and client-specific secure portals.",
      results: [
        "Increased billable hours by reducing administrative time",
        "Eliminated physical document storage costs",
        "Enhanced client communication and satisfaction",
        "Improved case management efficiency by 43%"
      ],
      icon: <Gavel className="h-8 w-8 text-primary" />
    }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Industry Use Cases</h3>
        <p className="text-muted-foreground mb-4">
          Real-world examples of how organizations across South Africa have successfully implemented e-Box.
        </p>
        
        <Tabs defaultValue="government" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="government">Government</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>
          
          {useCases.map((useCase, index) => (
            <TabsContent key={index} value={useCase.industry.toLowerCase()} className="space-y-4">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {useCase.icon}
                      </div>
                      <div>
                        <CardTitle>{useCase.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{useCase.industry} Sector</p>
                      </div>
                    </div>
                    <Badge variant="outline">Case Study</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Organization</h4>
                      <p className="text-sm">{useCase.organization}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Challenge</h4>
                      <p className="text-sm">{useCase.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Solution</h4>
                      <p className="text-sm">{useCase.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Results</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                        {useCase.results.map((result, idx) => (
                          <li key={idx}>{result}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="p-4 bg-muted/20 flex justify-end">
                  <Button variant="default" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Full Case Study
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <BookOpen className="h-16 w-16 text-primary" />
              <div className="flex-grow">
                <h3 className="text-xl font-medium">Complete Use Case Compilation</h3>
                <p className="text-muted-foreground mt-2">
                  Download our comprehensive collection of 25+ detailed case studies across multiple industries throughout South Africa. 
                  Includes implementation details, challenges, solutions, and measurable results.
                </p>
              </div>
              <Button className="gap-2 whitespace-nowrap">
                <Download className="h-4 w-4" />
                Download All Cases
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
