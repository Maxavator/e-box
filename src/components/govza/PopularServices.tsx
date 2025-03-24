
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, FileText, Car, Award, FileCheck, MapPin, School } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  department: string;
  link: string;
}

const ServiceCard = ({ icon, title, department, link }: ServiceCardProps) => {
  return (
    <Link to={link}>
      <Card className="h-full flex flex-col items-center p-4 text-center hover:shadow-md transition-shadow">
        <div className="rounded-full bg-primary/10 p-3 mb-3">
          {icon}
        </div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{department}</p>
      </Card>
    </Link>
  );
};

export const PopularServices = () => {
  const services = [
    {
      icon: <User className="h-5 w-5 text-primary" />,
      title: "Apply for ID Document",
      department: "Home Affairs",
      link: "/govza/home-affairs/id-application"
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Submit Tax Returns",
      department: "SARS",
      link: "/govza/sars/tax-returns"
    },
    {
      icon: <Car className="h-5 w-5 text-primary" />,
      title: "Renew Vehicle License",
      department: "Transport",
      link: "/govza/transport/license-renewal"
    },
    {
      icon: <Award className="h-5 w-5 text-primary" />,
      title: "Apply for Social Grants",
      department: "SASSA",
      link: "/govza/sassa/grants"
    },
    {
      icon: <FileCheck className="h-5 w-5 text-primary" />,
      title: "Apply for Birth Certificate",
      department: "Home Affairs",
      link: "/govza/home-affairs/birth-certificate"
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: "Find Municipal Services",
      department: "Local Government",
      link: "/govza/local-government/services"
    },
    {
      icon: <School className="h-5 w-5 text-primary" />,
      title: "Education Resources",
      department: "Education",
      link: "/govza/education/resources"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Popular Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};
