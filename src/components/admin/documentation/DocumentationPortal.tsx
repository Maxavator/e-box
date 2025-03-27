
import React, { useState } from "react";
import { CHANGELOG, ChangeLogEntry } from "@/utils/changelog";
import { APP_VERSION } from "@/utils/version";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesKit } from "./SalesKit";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart4, Megaphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DocumentationPortal() {
  const [activeTab, setActiveTab] = useState("changelog");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documentation Portal</h2>
          <p className="text-muted-foreground">
            System information, changelog, and product documentation
          </p>
        </div>
        <Badge variant="outline" className="text-xs py-1">
          Current Version: {APP_VERSION}
        </Badge>
      </div>

      <Tabs defaultValue="changelog" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
          <TabsTrigger value="changelog" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>Changelog</span>
          </TabsTrigger>
          <TabsTrigger value="saleskit" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <span>Sales Kit</span>
          </TabsTrigger>
          <TabsTrigger value="userdocs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>User Documentation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="changelog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Changelog</CardTitle>
              <CardDescription>
                A history of changes and updates to the e-Box platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {CHANGELOG.map((entry: ChangeLogEntry, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-baseline justify-between border-b pb-1">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {entry.version}
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Latest</Badge>
                      )}
                    </h3>
                    <span className="text-sm text-muted-foreground">{entry.date}</span>
                  </div>
                  <ul className="space-y-1 pl-5 list-disc">
                    {entry.changes.map((change, i) => (
                      <li key={i} className="text-sm">{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saleskit">
          <SalesKit />
        </TabsContent>

        <TabsContent value="userdocs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Documentation</CardTitle>
              <CardDescription>
                Guides, tutorials, and reference materials for e-Box users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Getting Started Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Basic introduction to e-Box features and navigation
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Administrator Manual</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed guide for system administrators
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Video Tutorials</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Step-by-step video guides for common tasks
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Access Videos
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />
              
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Need more help?</h3>
                <p className="text-muted-foreground mb-4">
                  Contact our support team for assistance with any questions or issues
                </p>
                <Button variant="default">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
