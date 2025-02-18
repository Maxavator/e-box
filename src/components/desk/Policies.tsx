
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Shield, ExternalLink, FileText, Pencil, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Policy {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "archived";
  lastUpdated: string;
  documentUrl?: string;
}

const policies: Policy[] = [
  {
    id: "1",
    name: "Information Security Policy",
    description: "Guidelines for handling sensitive information and data security protocols",
    status: "active",
    lastUpdated: "2024-03-15",
    documentUrl: "/policies/information_security_policy_e-box_by_afrovation.pdf"
  },
  {
    id: "2",
    name: "Remote Work Policy",
    description: "Rules and guidelines for remote work arrangements",
    status: "active",
    lastUpdated: "2024-02-28",
    documentUrl: "/policies/remote_work_policy_e-box_by_afrovation.pdf"
  },
  {
    id: "3",
    name: "Code of Conduct",
    description: "Expected behavior and professional standards for all employees",
    status: "active",
    lastUpdated: "2024-01-10",
    documentUrl: "/policies/code_of_conduct_e-box_by_afrovation.pdf"
  },
  {
    id: "4",
    name: "Travel & Expense Policy",
    description: "Guidelines for business travel and expense reimbursement",
    status: "draft",
    lastUpdated: "2024-03-18",
    documentUrl: "/policies/travel_expense_policy_draft_e-box_by_afrovation.pdf"
  }
];

const PolicyStatusBadge = ({ status }: { status: Policy["status"] }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-700"
  };

  const statusIcons = {
    active: <CheckCircle className="h-4 w-4 mr-1" />,
    draft: <Pencil className="h-4 w-4 mr-1" />,
    archived: <AlertTriangle className="h-4 w-4 mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {statusIcons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PolicyViewer = ({ policy }: { policy: Policy }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{policy.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Status</span>
          <PolicyStatusBadge status={policy.status} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last Updated</span>
          <span>{policy.lastUpdated}</span>
        </div>
      </div>

      {policy.documentUrl && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => {
            const link = document.createElement('a');
            link.href = policy.documentUrl!;
            link.download = policy.documentUrl!.split('/').pop() || 'policy.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Downloading ${policy.name}`);
          }}
        >
          <FileText className="h-4 w-4 mr-2" />
          Download Policy Document
        </Button>
      )}
    </div>
  );
};

export const Policies = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Organization Policies
          </CardTitle>
          <Button variant="outline" disabled>
            <Pencil className="h-4 w-4 mr-2" />
            Request Policy Change
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.name}</TableCell>
                    <TableCell>
                      <PolicyStatusBadge status={policy.status} />
                    </TableCell>
                    <TableCell>{policy.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPolicy(policy)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Policy Details</SheetTitle>
                            <SheetDescription>
                              View and download policy information
                            </SheetDescription>
                          </SheetHeader>
                          {selectedPolicy && <PolicyViewer policy={selectedPolicy} />}
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
