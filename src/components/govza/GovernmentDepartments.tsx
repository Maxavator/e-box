
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { User, FileText, Car, Award, Building2, Stethoscope, School } from "lucide-react";

interface DepartmentProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  id: string;
  onSelectDepartment: (id: string) => void;
}

const Department = ({ icon, title, description, id, onSelectDepartment }: DepartmentProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-2">
        <div className="rounded-full bg-primary/10 p-2">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => onSelectDepartment(id)}
        className="text-sm text-primary hover:underline"
      >
        Click to access services
      </button>
    </Card>
  );
};

interface GovernmentDepartmentsProps {
  onSelectDepartment: (id: string) => void;
}

export const GovernmentDepartments = ({ onSelectDepartment }: GovernmentDepartmentsProps) => {
  const departments = [
    {
      icon: <User className="h-5 w-5 text-primary" />,
      title: "Department of Home Affairs",
      description: "ID documents, passports, birth certificates and more",
      id: "home-affairs"
    },
    {
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "South African Revenue Service",
      description: "Tax returns, customs, excise and more",
      id: "sars"
    },
    {
      icon: <Car className="h-5 w-5 text-primary" />,
      title: "Department of Transport",
      description: "Vehicle licensing, driver's licenses, transport services",
      id: "transport"
    },
    {
      icon: <Award className="h-5 w-5 text-primary" />,
      title: "South African Social Security Agency",
      description: "Social grants, COVID-19 relief, pension and disability grants",
      id: "sassa"
    },
    {
      icon: <Building2 className="h-5 w-5 text-primary" />,
      title: "Department of Labour",
      description: "UIF, compensation fund, employment services",
      id: "labour"
    },
    {
      icon: <School className="h-5 w-5 text-primary" />,
      title: "Department of Education",
      description: "School registration, educational resources",
      id: "education"
    },
    {
      icon: <Stethoscope className="h-5 w-5 text-primary" />,
      title: "Department of Health",
      description: "Health services, COVID-19 resources, vaccination",
      id: "health"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Government Departments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, index) => (
          <Department key={index} {...dept} onSelectDepartment={onSelectDepartment} />
        ))}
      </div>
    </div>
  );
};
