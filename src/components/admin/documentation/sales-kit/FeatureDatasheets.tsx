
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileImage, FileText, Shield, MessagesSquare, Calendar, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FeatureSheetProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  fileSize: string;
  lastUpdated: string;
  gradient: string;
}

function FeatureSheet({ title, description, icon, fileSize, lastUpdated, gradient }: FeatureSheetProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className={`relative h-32 ${gradient} flex items-center justify-center`}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background p-3 rounded-full shadow-lg">
          {icon}
        </div>
      </div>
      <CardContent className="p-5 flex-grow">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {description}
          </p>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 bg-muted/20 flex justify-between">
        <Badge variant="outline" className="shrink-0">
          PDF ({fileSize})
        </Badge>
        <Button variant="default" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}

export function FeatureDatasheets() {
  const featureSheets: FeatureSheetProps[] = [
    {
      title: "Document Management",
      description: "Secure document storage, versioning, sharing, and collaborative editing features.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      fileSize: "2.1 MB",
      lastUpdated: "July 2024",
      gradient: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30"
    },
    {
      title: "Security & Compliance",
      description: "Comprehensive security features and South African regulatory compliance capabilities.",
      icon: <Shield className="h-8 w-8 text-primary" />,
      fileSize: "1.8 MB",
      lastUpdated: "July 2024",
      gradient: "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30"
    },
    {
      title: "Team Communication",
      description: "Secure messaging, team channels, and notification management features.",
      icon: <MessagesSquare className="h-8 w-8 text-primary" />,
      fileSize: "1.5 MB",
      lastUpdated: "July 2024",
      gradient: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30"
    },
    {
      title: "Scheduling & Calendar",
      description: "Intelligent scheduling with South African holiday integration and team availability.",
      icon: <Calendar className="h-8 w-8 text-primary" />,
      fileSize: "1.7 MB",
      lastUpdated: "July 2024",
      gradient: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30"
    },
    {
      title: "Administration Tools",
      description: "Comprehensive admin portal with user management, reporting, and system settings.",
      icon: <UsersRound className="h-8 w-8 text-primary" />,
      fileSize: "2.3 MB",
      lastUpdated: "July 2024",
      gradient: "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Feature-Specific Datasheets</h3>
        <p className="text-muted-foreground mb-4">
          Detailed technical information about specific e-Box features and capabilities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureSheets.map((sheet, index) => (
            <FeatureSheet key={index} {...sheet} />
          ))}
        </div>
      </div>
      
      <div className="mt-8">
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <FileImage className="h-12 w-12 text-primary" />
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-medium">Need a custom datasheet?</h3>
                <p className="text-sm text-muted-foreground">
                  Our marketing team can create tailored datasheets for specific industries or use cases.
                </p>
              </div>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                Request Custom Sheet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
