import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, FileText, Lock, ShieldCheck, Book, FileImage, BookOpen, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DatasheetSection } from "./sales-kit/DatasheetSection";
import { FeatureDatasheets } from "./sales-kit/FeatureDatasheets";
import { UseCasesSection } from "./sales-kit/UseCasesSection";

export function SalesKit() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-baseline justify-between">
            <div>
              <CardTitle className="text-2xl">e-Box Sales Kit</CardTitle>
              <CardDescription>
                Documentation and resources for sales and partnership engagements
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-2">Confidential</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>For authorized personnel only</AlertTitle>
            <AlertDescription>
              This documentation contains confidential information intended for authorized 
              Afrovation personnel and certified partners only.
            </AlertDescription>
          </Alert>
          
          <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6 overflow-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demo">Demo & POC</TabsTrigger>
              <TabsTrigger value="licensing">Licensing</TabsTrigger>
              <TabsTrigger value="sla">SLA</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="datasheets" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                <span>Datasheets</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Feature Sheets</span>
              </TabsTrigger>
              <TabsTrigger value="usecases" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Use Cases</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">e-Box by Afrovation</h3>
                <p className="text-muted-foreground">
                  e-Box is a comprehensive digital workspace solution developed by Afrovation Technology 
                  Solutions (Pty) Ltd, designed specifically for South African organizations. It combines 
                  document management, secure messaging, team collaboration, and administrative tools in 
                  a single platform that adheres to local data protection standards.
                </p>
                
                <h4 className="font-medium mt-6">Key Features</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Secure document management with version control</li>
                  <li>Team communication and collaboration tools</li>
                  <li>Administrative portal with detailed reporting</li>
                  <li>Multi-organization support with role-based access control</li>
                  <li>Calendar and scheduling with South African holidays</li>
                  <li>South African compliance-ready with POPIA alignment</li>
                </ul>
                
                <h4 className="font-medium mt-6">Target Market</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Government departments and public sector organizations</li>
                  <li>Financial services and insurance providers</li>
                  <li>Healthcare organizations</li>
                  <li>Educational institutions</li>
                  <li>Medium to large enterprises with compliance requirements</li>
                </ul>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Product Sheet
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Demo and POC Guidelines</h3>
                
                <Alert className="my-4 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                  <AlertTitle>Demo Environment Disclaimer</AlertTitle>
                  <AlertDescription>
                    The demo environment uses anonymized test data and is hosted separately from production 
                    infrastructure. All demonstrations should emphasize that production deployments follow 
                    stricter security and data controls.
                  </AlertDescription>
                </Alert>
                
                <h4 className="font-medium mt-6">Demo Environments</h4>
                <p className="text-muted-foreground">
                  Afrovation provides standardized demo environments that showcase key features while 
                  maintaining consistent messaging. Partners should use only approved demo environments 
                  and follow the demo script guidelines.
                </p>
                
                <h4 className="font-medium mt-6">POC Process</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Submit POC request with specific client requirements</li>
                  <li>POC approval from Afrovation product team</li>
                  <li>POC environment setup (2-3 business days)</li>
                  <li>Client access provisioning with limited test data</li>
                  <li>POC period (typically 14-30 days)</li>
                  <li>POC review meeting and next steps</li>
                </ol>
                
                <h4 className="font-medium mt-6">POC Limitations</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Limited to 25 test users</li>
                  <li>Some enterprise features disabled</li>
                  <li>Data retention limited to POC period</li>
                  <li>Integration capabilities limited to standard connectors</li>
                </ul>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download POC Guidelines
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="licensing" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">OEM License Agreement</h3>
                <p className="text-muted-foreground">
                  The OEM License Agreement outlines the terms and conditions for organizations that wish 
                  to integrate e-Box functionality into their own software products or services.
                </p>
                
                <h4 className="font-medium mt-6">License Models</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Per User License</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        <li>Annual commitment with monthly billing</li>
                        <li>Volume discounts available</li>
                        <li>Full feature access</li>
                        <li>Standard SLA included</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Enterprise License</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        <li>Unlimited users within single organization</li>
                        <li>Annual billing with 3-year minimum term</li>
                        <li>Custom deployment options</li>
                        <li>Enhanced SLA included</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>OEM Integration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        <li>White-label options available</li>
                        <li>API access and custom development</li>
                        <li>Revenue sharing model</li>
                        <li>Joint marketing opportunities</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="font-medium mt-6">License Terms</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Initial term (12, 24, or 36 months)</li>
                  <li>Automatic renewal terms</li>
                  <li>License expansion provisions</li>
                  <li>Territory restrictions</li>
                  <li>Usage limitations</li>
                </ul>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View License Agreement Template
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sla" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SaaS Service Level Agreement</h3>
                <p className="text-muted-foreground">
                  Our SLA defines the expected service levels, availability guarantees, and support 
                  responsiveness for e-Box cloud deployments.
                </p>
                
                <h4 className="font-medium mt-6">Service Availability</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Standard</CardTitle>
                      <Badge>99.5% Uptime</Badge>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Less than 3.6 hours of downtime per month</p>
                      <p className="mt-2">Included with standard subscription</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Business</CardTitle>
                      <Badge>99.9% Uptime</Badge>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Less than 43 minutes of downtime per month</p>
                      <p className="mt-2">Included with business subscription</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Enterprise</CardTitle>
                      <Badge>99.99% Uptime</Badge>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Less than 4.3 minutes of downtime per month</p>
                      <p className="mt-2">Included with enterprise subscription</p>
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="font-medium mt-6">Support Response Times</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Severity</th>
                      <th className="text-left py-2">Standard</th>
                      <th className="text-left py-2">Business</th>
                      <th className="text-left py-2">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Critical</td>
                      <td>4 hours</td>
                      <td>2 hours</td>
                      <td>1 hour</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">High</td>
                      <td>8 hours</td>
                      <td>4 hours</td>
                      <td>2 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Medium</td>
                      <td>24 hours</td>
                      <td>12 hours</td>
                      <td>8 hours</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Low</td>
                      <td>48 hours</td>
                      <td>36 hours</td>
                      <td>24 hours</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Full SLA
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Platform Privacy and Security</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lock className="h-5 w-5 mr-2" />
                        Data Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        e-Box employs multiple layers of security to protect customer data:
                      </p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>AES-256 encryption for data at rest</li>
                        <li>TLS 1.3 for all data in transit</li>
                        <li>Regular penetration testing by independent firms</li>
                        <li>Role-based access control (RBAC)</li>
                        <li>Multi-factor authentication support</li>
                        <li>IP restriction capabilities</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShieldCheck className="h-5 w-5 mr-2" />
                        Compliance & Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        e-Box maintains compliance with key standards:
                      </p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>ISO 27001 certified</li>
                        <li>POPIA compliant</li>
                        <li>SOC 2 Type II audited</li>
                        <li>GDPR aligned for multinational operations</li>
                        <li>Annual compliance review & attestation</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="font-medium mt-6">Security Features</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Document-level encryption and access controls</li>
                  <li>Comprehensive audit logging of all user actions</li>
                  <li>Automated threat detection and blocking</li>
                  <li>Regular vulnerability scanning and patching</li>
                  <li>Data loss prevention controls</li>
                  <li>Configurable session timeout settings</li>
                </ul>
                
                <h4 className="font-medium mt-6">Data Center Security</h4>
                <p className="text-muted-foreground">
                  e-Box is hosted in Tier 3+ data centers in South Africa with 24/7 security personnel, 
                  biometric access controls, redundant power and cooling, and comprehensive environmental 
                  monitoring.
                </p>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Security Whitepaper
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management Agreement</h3>
                <p className="text-muted-foreground">
                  The Data Management Agreement defines how customer data is processed, stored, 
                  and managed within the e-Box platform.
                </p>
                
                <h4 className="font-medium mt-6">Data Processing</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Customer remains the data controller</li>
                  <li>Afrovation acts as the data processor</li>
                  <li>Processing limited to service provision</li>
                  <li>No secondary use of customer data</li>
                  <li>No third-party data sharing without explicit consent</li>
                </ul>
                
                <h4 className="font-medium mt-6">Data Retention & Deletion</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard 30-day retention after subscription termination</li>
                  <li>Extended retention options available</li>
                  <li>Certificate of deletion provided upon request</li>
                  <li>Sanitization of storage media following NIST guidelines</li>
                </ul>
                
                <h4 className="font-medium mt-6">Data Backup & Recovery</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Daily incremental backups</li>
                  <li>Weekly full backups</li>
                  <li>30-day backup retention standard</li>
                  <li>Point-in-time recovery capabilities</li>
                  <li>Regular disaster recovery testing</li>
                </ul>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View Data Management Agreement
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Help and Support Agreement</h3>
                <p className="text-muted-foreground">
                  Our support agreement outlines the support services, channels, and processes 
                  available to customers and partners.
                </p>
                
                <h4 className="font-medium mt-6">Support Channels</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Email Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Available to all subscription levels</p>
                      <p className="mt-2">support@afrovation.co.za</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Phone Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Business & Enterprise plans</p>
                      <p className="mt-2">+27 21 555 1234</p>
                      <p>Mon-Fri, 8am-5pm SAST</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Premium Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>Enterprise plans only</p>
                      <p className="mt-2">Dedicated support manager</p>
                      <p>24/7 critical issue response</p>
                    </CardContent>
                  </Card>
                </div>
                
                <h4 className="font-medium mt-6">Support Services</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Technical support for platform issues</li>
                  <li>User administration assistance</li>
                  <li>Configuration guidance</li>
                  <li>Integration troubleshooting</li>
                  <li>Regular maintenance updates</li>
                </ul>
                
                <h4 className="font-medium mt-6">Partner Support</h4>
                <p className="text-muted-foreground">
                  Certified partners receive dedicated partner support channels, advanced training resources, 
                  and early access to product updates.
                </p>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Support Information
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">South African Compliance Guidelines</h3>
                
                <h4 className="font-medium mt-4">Data Sovereignty</h4>
                <p className="text-muted-foreground">
                  e-Box ensures all customer data remains within South African borders, in compliance with 
                  local data sovereignty requirements. Primary and backup data centers are located exclusively 
                  in South Africa.
                </p>
                
                <h4 className="font-medium mt-6">POPIA Compliance</h4>
                <p className="text-muted-foreground">
                  The Protection of Personal Information Act (POPIA) establishes minimum requirements for 
                  processing personal information. e-Box provides the following POPIA-compliant capabilities:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Consent management mechanisms</li>
                  <li>Data subject access request workflows</li>
                  <li>Purpose limitation controls</li>
                  <li>Data minimization capabilities</li>
                  <li>Security safeguards aligned with POPIA requirements</li>
                  <li>Accountability and documentation features</li>
                </ul>
                
                <h4 className="font-medium mt-6">Regulatory Frameworks</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>South African Reserve Bank (SARB) guidelines for financial institutions</li>
                  <li>South African Revenue Service (SARS) electronic record-keeping requirements</li>
                  <li>Electronic Communications and Transactions (ECT) Act compliance</li>
                  <li>Consumer Protection Act (CPA) alignment</li>
                </ul>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Compliance Guide
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="datasheets">
              <DatasheetSection />
            </TabsContent>
            
            <TabsContent value="features">
              <FeatureDatasheets />
            </TabsContent>
            
            <TabsContent value="usecases">
              <UseCasesSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
