
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Calendar, Globe, BookOpen, CircleDollarSign, Landmark, 
  Megaphone, Flag, AlertCircle, MapPin, FileDigit, ExternalLink
} from "lucide-react";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url: string;
  isExternal?: boolean;
  category?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, title, description, url, isExternal = false, category 
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start mb-2">
          <div className="rounded-full bg-primary/10 p-2 mr-3">
            {icon}
          </div>
          {category && (
            <Badge variant="outline" className="ml-auto">
              {category}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href={url} target={isExternal ? "_blank" : "_self"} rel="noopener noreferrer">
            {isExternal ? (
              <>
                View Resource <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "View Resource"
            )}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface GovInformationSectionProps {
  searchQuery: string;
}

export const GovInformationSection: React.FC<GovInformationSectionProps> = ({ searchQuery }) => {
  const infoResources: InfoCardProps[] = [
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: "Public Holidays 2024",
      description: "Official calendar of South African public holidays",
      url: "/govza/information/public-holidays",
      category: "Calendar"
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Government Gazette",
      description: "Access the latest Government Gazette publications",
      url: "https://www.gov.za/documents/south-african-government-gazette",
      isExternal: true,
      category: "Publications"
    },
    {
      icon: <Globe className="h-5 w-5 text-primary" />,
      title: "Travel Advisories",
      description: "Current travel advisories and COVID-19 regulations",
      url: "/govza/information/travel-advisories",
      category: "Travel"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Acts & Legislation",
      description: "Browse South African acts and legislation",
      url: "/govza/information/legislation",
      category: "Legal"
    },
    {
      icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
      title: "Budget & Treasury",
      description: "National budget information and fiscal policies",
      url: "/govza/information/budget",
      category: "Finance"
    },
    {
      icon: <Landmark className="h-5 w-5 text-primary" />,
      title: "Parliament Updates",
      description: "The latest updates from the South African Parliament",
      url: "https://www.parliament.gov.za",
      isExternal: true,
      category: "Government"
    },
    {
      icon: <Megaphone className="h-5 w-5 text-primary" />,
      title: "Press Releases",
      description: "Official government press releases and statements",
      url: "/govza/information/press-releases",
      category: "News"
    },
    {
      icon: <Flag className="h-5 w-5 text-primary" />,
      title: "National Symbols",
      description: "South African flag, anthem and national symbols",
      url: "/govza/information/national-symbols",
      category: "Heritage"
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-primary" />,
      title: "Disaster Management",
      description: "Emergency information and disaster management resources",
      url: "/govza/information/disaster-management",
      category: "Emergency"
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Provincial Information",
      description: "Information specific to each South African province",
      url: "/govza/information/provinces",
      category: "Regional"
    },
    {
      icon: <FileDigit className="h-5 w-5 text-primary" />,
      title: "Stats SA Reports",
      description: "Statistical reports and data from Statistics South Africa",
      url: "https://www.statssa.gov.za",
      isExternal: true,
      category: "Statistics"
    }
  ];

  // Filter resources based on search query
  const filteredResources = searchQuery
    ? infoResources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.category && resource.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : infoResources;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Government Information</h2>
        <p className="text-muted-foreground">
          Access official information, publications, and resources from the South African government.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource, index) => (
          <InfoCard key={index} {...resource} />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No information resources found matching "{searchQuery}"</p>
          <Button variant="outline" onClick={() => window.location.href = "/govza/information/request"}>
            Request Information
          </Button>
        </div>
      )}

      <Separator className="my-8" />
      
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Looking for specific information?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you can't find the information you're looking for, you can contact the relevant government department directly.
        </p>
        <Button variant="default">
          <Globe className="mr-2 h-4 w-4" />
          View All Departments
        </Button>
      </div>
    </div>
  );
};
