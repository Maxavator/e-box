
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Database, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function SystemsDocumentation() {
  const [activeTab, setActiveTab] = useState("sla");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Systems Documentation</h2>
          <p className="text-muted-foreground">
            Technical documentation, architecture, and SLAs
          </p>
        </div>
      </div>

      <Tabs defaultValue="sla" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="sla" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>SLA & Uptime</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="tech-specs" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            <span>Technical Specifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sla" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Level Agreements</CardTitle>
              <CardDescription>
                Our commitment to system reliability and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Uptime Guarantee</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">99.9%</span>
                      <Badge variant="outline" className="text-xs">Monthly</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Maximum monthly downtime: 43 minutes
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">&lt; 1s</span>
                      <Badge variant="outline" className="text-xs">API Calls</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Average response time for standard API calls
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Support Response</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">4h</span>
                      <Badge variant="outline" className="text-xs">Business Hours</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Maximum time to first response for critical issues
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SLA Details</h3>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <span className="font-medium">Incident Classification</span>
                    <Shield className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Critical:</strong> System-wide outage affecting all users</li>
                      <li><strong>High:</strong> Major functionality impacted, affecting multiple users</li>
                      <li><strong>Medium:</strong> Limited functionality impacted, workaround available</li>
                      <li><strong>Low:</strong> Minor issue with minimal impact</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <span className="font-medium">Response Times by Severity</span>
                    <Shield className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Critical:</strong> 1 hour response, 4 hour resolution target</li>
                      <li><strong>High:</strong> 4 hour response, 8 hour resolution target</li>
                      <li><strong>Medium:</strong> 8 hour response, 24 hour resolution target</li>
                      <li><strong>Low:</strong> 24 hour response, 72 hour resolution target</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <span className="font-medium">Maintenance Windows</span>
                    <Shield className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <p className="text-sm mb-2">
                      Scheduled maintenance is performed during the following windows:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Weekly:</strong> Sundays, 01:00 - 03:00 UTC</li>
                      <li><strong>Monthly:</strong> Last Sunday of the month, 01:00 - 05:00 UTC</li>
                      <li><strong>Emergency:</strong> As needed with minimum 2 hour notice</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="flex gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Download Full SLA Document</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture</CardTitle>
              <CardDescription>
                Technical infrastructure and system design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 border rounded-md bg-gray-50 dark:bg-gray-900 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground mb-4">
                  System architecture diagram will appear here
                </p>
                <Button variant="outline" size="sm">View Full Diagram</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Architecture Overview</h3>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <span className="font-medium">Frontend Architecture</span>
                    <LayoutGrid className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Framework:</strong> React with TypeScript</li>
                      <li><strong>State Management:</strong> React Query, Context API</li>
                      <li><strong>Styling:</strong> Tailwind CSS, Shadcn UI</li>
                      <li><strong>Build Tool:</strong> Vite</li>
                      <li><strong>Hosting:</strong> Edge-distributed CDN</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <span className="font-medium">Backend Architecture</span>
                    <Database className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Database:</strong> PostgreSQL with Supabase</li>
                      <li><strong>Authentication:</strong> Supabase Auth with JWT</li>
                      <li><strong>API Layer:</strong> RESTful API, Supabase Functions</li>
                      <li><strong>Serverless Functions:</strong> Edge Functions</li>
                      <li><strong>File Storage:</strong> Supabase Storage</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible className="border rounded-md">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <span className="font-medium">Infrastructure</span>
                    <Shield className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Hosting:</strong> Global edge network</li>
                      <li><strong>Scaling:</strong> Auto-scaling based on demand</li>
                      <li><strong>CDN:</strong> Global content delivery network</li>
                      <li><strong>Security:</strong> SSL/TLS, DDoS protection, WAF</li>
                      <li><strong>Monitoring:</strong> Real-time performance and error tracking</li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="flex gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Download Architecture Document</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tech-specs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>
                Detailed technical information and system requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Browser Support:</strong> Chrome, Firefox, Safari, Edge (latest 2 versions)</li>
                      <li><strong>Minimum Connection:</strong> 1 Mbps broadband connection</li>
                      <li><strong>Mobile Support:</strong> iOS 14+, Android 10+</li>
                      <li><strong>Screen Resolution:</strong> Minimum 1280 x 720</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2 text-sm">
                      <li><strong>Initial Load Time:</strong> &lt; 2 seconds (95th percentile)</li>
                      <li><strong>API Response Time:</strong> &lt; 500ms (95th percentile)</li>
                      <li><strong>Concurrent Users:</strong> Up to 10,000 per instance</li>
                      <li><strong>Database Queries:</strong> &lt; 100ms average response time</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Documentation</h3>
                
                <p className="text-sm text-muted-foreground">
                  The system provides a comprehensive REST API for integration with external systems.
                  All endpoints are secured using JWT authentication.
                </p>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="flex gap-2">
                    <FileText className="h-4 w-4" />
                    <span>View API Documentation</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
