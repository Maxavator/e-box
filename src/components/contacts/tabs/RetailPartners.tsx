
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Building2, Store, StoreIcon, ReceiptText, BriefcaseBusiness } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyContacts } from "../components/EmptyContacts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Mock data - replace with actual API call
const retailPartners = [
  {
    id: "1",
    name: "SuperSaver Market",
    businessType: "Grocery Retail",
    registrationNumber: "2020/123456/07",
    isVerified: true,
    stakeholderType: "Customer"
  },
  {
    id: "2",
    name: "TechWorld Solutions",
    businessType: "Electronics",
    registrationNumber: "2018/987654/07",
    isVerified: true,
    stakeholderType: "Supplier"
  }
];

export const RetailPartners = () => {
  // For demo - replace with actual API call
  const isLoading = false;
  
  const handlePartnerAction = (action: string, partnerId: string) => {
    toast.info(`${action} for partner ID: ${partnerId} will be implemented soon`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading retail partners...</p>
      </div>
    );
  }
  
  if (retailPartners.length === 0) {
    return <EmptyContacts type="retail" />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What are Retail Partners?</CardTitle>
          <CardDescription>
            Retail Partners are businesses where you are a confirmed stakeholder. 
            This allows secure communication and document sharing with these organizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md flex flex-col items-center text-center">
              <Store className="h-10 w-10 text-blue-600 mb-2" />
              <h3 className="font-medium">Business Relationship</h3>
              <p className="text-sm text-muted-foreground">
                Connect with businesses you regularly interact with
              </p>
            </div>
            <div className="p-4 border rounded-md flex flex-col items-center text-center">
              <BriefcaseBusiness className="h-10 w-10 text-green-600 mb-2" />
              <h3 className="font-medium">Stakeholder Verification</h3>
              <p className="text-sm text-muted-foreground">
                Verified connection as a customer, supplier, or employee
              </p>
            </div>
            <div className="p-4 border rounded-md flex flex-col items-center text-center">
              <ReceiptText className="h-10 w-10 text-amber-600 mb-2" />
              <h3 className="font-medium">Document Exchange</h3>
              <p className="text-sm text-muted-foreground">
                Securely exchange invoices, statements and communications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Registration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Relationship</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {retailPartners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <StoreIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    {partner.name}
                  </div>
                </div>
              </TableCell>
              <TableCell>{partner.businessType}</TableCell>
              <TableCell>{partner.registrationNumber}</TableCell>
              <TableCell>
                {partner.isVerified ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {partner.stakeholderType}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePartnerAction("View Documents", partner.id)}>
                      <ReceiptText className="mr-2 h-4 w-4" />
                      View Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePartnerAction("View Business Profile", partner.id)}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Business Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePartnerAction("Contact Representatives", partner.id)}>
                      <StoreIcon className="mr-2 h-4 w-4" />
                      Contact Representatives
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
