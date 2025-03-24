
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  FileText, User, Building, Car, Home, School, Stethoscope, Briefcase, 
  FileSearch, Calendar, CreditCard, UserCheck, CircleDollarSign, Map
} from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
  tags?: string[];
  isPopular?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon, title, description, linkTo, tags = [], isPopular = false 
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="rounded-full bg-primary/10 p-2 mb-2">
            {icon}
          </div>
          {isPopular && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Popular
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-0 flex-grow">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" asChild>
          <Link to={linkTo}>Access Service</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface GovServicesSectionProps {
  searchQuery: string;
}

export const GovServicesSection: React.FC<GovServicesSectionProps> = ({ searchQuery }) => {
  const services: ServiceCardProps[] = [
    {
      icon: <User className="h-5 w-5 text-primary" />,
      title: "ID Documents",
      description: "Apply for or renew your South African ID or Smart ID Card",
      linkTo: "/govza/services/id-documents",
      tags: ["Identity", "Home Affairs"],
      isPopular: true
    },
    {
      icon: <User className="h-5 w-5 text-primary" />,
      title: "Passport Applications",
      description: "Apply for a new passport or renew your existing one",
      linkTo: "/govza/services/passports",
      tags: ["Identity", "Travel", "Home Affairs"],
      isPopular: true
    },
    {
      icon: <Car className="h-5 w-5 text-primary" />,
      title: "Vehicle Registration",
      description: "Register a vehicle or renew your vehicle license",
      linkTo: "/govza/services/vehicle-registration",
      tags: ["Transport", "License"]
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Birth Certificates",
      description: "Apply for birth certificates for newborns or replacements",
      linkTo: "/govza/services/birth-certificates",
      tags: ["Certificate", "Home Affairs"]
    },
    {
      icon: <Building className="h-5 w-5 text-primary" />,
      title: "Company Registration",
      description: "Register a new business or company with CIPC",
      linkTo: "/govza/services/company-registration",
      tags: ["Business", "CIPC"]
    },
    {
      icon: <Home className="h-5 w-5 text-primary" />,
      title: "Housing Subsidies",
      description: "Apply for government housing subsidies and programs",
      linkTo: "/govza/services/housing",
      tags: ["Housing", "Subsidies"]
    },
    {
      icon: <School className="h-5 w-5 text-primary" />,
      title: "Education Services",
      description: "School registration, NSFAS applications, and academic resources",
      linkTo: "/govza/services/education",
      tags: ["Education", "Financial Aid"],
      isPopular: true
    },
    {
      icon: <Stethoscope className="h-5 w-5 text-primary" />,
      title: "Healthcare",
      description: "National Health Insurance information and healthcare services",
      linkTo: "/govza/services/healthcare",
      tags: ["Health", "Insurance"]
    },
    {
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      title: "UIF & Unemployment",
      description: "Apply for UIF benefits and browse job opportunities",
      linkTo: "/govza/services/uif",
      tags: ["Employment", "Benefits"],
      isPopular: true
    },
    {
      icon: <FileSearch className="h-5 w-5 text-primary" />,
      title: "Police Clearance",
      description: "Apply for police clearance certificate",
      linkTo: "/govza/services/police-clearance",
      tags: ["Security", "Certificate"]
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      title: "Government Appointments",
      description: "Book appointments with various government departments",
      linkTo: "/govza/services/appointments",
      tags: ["Booking", "Service"]
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      title: "SASSA Grants",
      description: "Apply for and manage social grants and payments",
      linkTo: "/govza/services/sassa",
      tags: ["Grants", "Social Services"],
      isPopular: true
    },
  ];

  // Filter services based on search query
  const filteredServices = searchQuery
    ? services.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : services;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Government Services</h2>
        <p className="text-muted-foreground">
          Access a wide range of South African government services online.
          {searchQuery && filteredServices.length === 0 && " No services found matching your search."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No services found matching "{searchQuery}"</p>
          <Button variant="outline" onClick={() => window.location.href = "/govza/services/request"}>
            Request a New Service
          </Button>
        </div>
      )}
    </div>
  );
};
