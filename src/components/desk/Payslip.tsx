
import { useState } from "react";
import { 
  FileText, Download, Eye, Shield, Calendar, DollarSign, 
  FileStack, ClipboardCheck, TrendingUp, Pencil 
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Mock data for payslips
const mockPayslips = [
  {
    id: "1",
    period: "March 2024",
    dateIssued: "2024-04-01",
    grossAmount: "R 25,500.00",
    netAmount: "R 19,375.50",
    status: "current",
    tax: "R 5,100.00",
    deductions: "R 1,024.50",
    benefits: "R 1,500.00"
  },
  {
    id: "2",
    period: "February 2024",
    dateIssued: "2024-03-01",
    grossAmount: "R 25,500.00",
    netAmount: "R 19,375.50",
    status: "previous",
    tax: "R 5,100.00",
    deductions: "R 1,024.50",
    benefits: "R 1,500.00"
  },
  {
    id: "3",
    period: "January 2024",
    dateIssued: "2024-02-01",
    grossAmount: "R 25,500.00",
    netAmount: "R 19,375.50",
    status: "previous",
    tax: "R 5,100.00",
    deductions: "R 1,024.50",
    benefits: "R 1,500.00"
  }
];

// Mock data for earnings and deductions
const mockEarnings = [
  { description: "Basic Salary", amount: "R 22,000.00" },
  { description: "Performance Bonus", amount: "R 2,000.00" },
  { description: "Travel Allowance", amount: "R 1,500.00" }
];

const mockDeductions = [
  { description: "Income Tax", amount: "R 5,100.00" },
  { description: "Pension Fund", amount: "R 500.00" },
  { description: "Medical Aid", amount: "R 450.00" },
  { description: "UIF", amount: "R 74.50" }
];

export const Payslip = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedPayslip, setSelectedPayslip] = useState(mockPayslips[0]);
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Downloading payslip",
      description: `${selectedPayslip.period} payslip will be downloaded shortly.`,
    });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSelected = value === 'current' 
      ? mockPayslips.find(p => p.status === 'current') 
      : mockPayslips[0];
    
    if (newSelected) {
      setSelectedPayslip(newSelected);
    }
  };
  
  const handlePayslipSelect = (payslip: typeof mockPayslips[0]) => {
    setSelectedPayslip(payslip);
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileStack className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Payslips</h1>
            <p className="text-sm text-muted-foreground">View and download your salary information</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Secured</span>
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <ClipboardCheck className="h-3 w-3" />
            <span>Official Document</span>
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Payslip History
              </CardTitle>
              <CardDescription>View your previous payslips</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs 
                defaultValue="current" 
                value={activeTab}
                onValueChange={handleTabChange}
              >
                <TabsList className="grid grid-cols-2 m-2">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="previous">Previous</TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="m-0">
                  <div className="divide-y">
                    {mockPayslips.filter(p => p.status === 'current').map(payslip => (
                      <div 
                        key={payslip.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedPayslip.id === payslip.id ? 'bg-muted' : ''}`}
                        onClick={() => handlePayslipSelect(payslip)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{payslip.period}</div>
                            <div className="text-sm text-muted-foreground">
                              Issue Date: {new Date(payslip.dateIssued).toLocaleDateString('en-ZA')}
                            </div>
                          </div>
                          <Badge variant="default">Current</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="previous" className="m-0">
                  <div className="divide-y">
                    {mockPayslips.filter(p => p.status === 'previous').map(payslip => (
                      <div 
                        key={payslip.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedPayslip.id === payslip.id ? 'bg-muted' : ''}`}
                        onClick={() => handlePayslipSelect(payslip)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{payslip.period}</div>
                            <div className="text-sm text-muted-foreground">
                              Issue Date: {new Date(payslip.dateIssued).toLocaleDateString('en-ZA')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-center p-4">
              <Button variant="outline" className="w-full" disabled>
                <Pencil className="h-4 w-4 mr-2" />
                Tax Certificate
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Payslip Details</CardTitle>
                <CardDescription>{selectedPayslip.period}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="default" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="shadow-none border">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Gross Pay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedPayslip.grossAmount}</div>
                    <div className="text-xs text-muted-foreground">Before deductions</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-none border">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Net Pay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{selectedPayslip.netAmount}</div>
                    <div className="text-xs text-muted-foreground">Amount paid to account</div>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="earnings">
                <TabsList className="w-full">
                  <TabsTrigger value="earnings" className="flex-1">Earnings</TabsTrigger>
                  <TabsTrigger value="deductions" className="flex-1">Deductions</TabsTrigger>
                </TabsList>
                <TabsContent value="earnings">
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockEarnings.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.amount}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium">
                        <TableCell>Total Earnings</TableCell>
                        <TableCell className="text-right">{selectedPayslip.grossAmount}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="deductions">
                  <Table className="mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDeductions.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.amount}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-medium">
                        <TableCell>Total Deductions</TableCell>
                        <TableCell className="text-right">{selectedPayslip.tax}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground border-t p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Document ID: PAY-{selectedPayslip.id}-{selectedPayslip.period.replace(' ', '-')}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
