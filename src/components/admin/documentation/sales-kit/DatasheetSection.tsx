
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileImage, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function DatasheetSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">e-Box Combined Product Datasheet</h3>
        <p className="text-muted-foreground">
          Comprehensive product information in a professionally designed format suitable for client presentations.
        </p>
        
        <Card className="overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-md bg-white dark:bg-background p-6 rounded-lg shadow-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-primary">e-Box</div>
                  <div className="text-xs text-muted-foreground">by Afrovation</div>
                </div>
                <div className="h-2 bg-primary/20 rounded-full mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted rounded-full w-2/3" />
                  <div className="h-3 bg-muted rounded-full w-full" />
                </div>
              </div>
            </div>
            <FileImage className="h-16 w-16 text-primary/50 absolute bottom-2 right-2" />
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">Complete e-Box Product Datasheet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  16-page comprehensive document covering all product features, technical specifications, 
                  and deployment scenarios.
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Technical specifications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Deployment options</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Feature comparison tables</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>System requirements</span>
                  </div>
                </div>
              </div>
              
              <Badge variant="outline" className="shrink-0">
                PDF (4.2 MB)
              </Badge>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="p-4 bg-muted/20 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: July 2024
            </div>
            <Button variant="default" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Datasheet
            </Button>
          </CardFooter>
        </Card>
        
        <h3 className="text-lg font-medium mt-8">Executive Summary Datasheet</h3>
        <p className="text-muted-foreground">
          Condensed two-page overview designed for executive decision-makers.
        </p>
        
        <Card className="overflow-hidden">
          <div className="relative h-40 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-sm bg-white dark:bg-background p-4 rounded-lg shadow-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-bold text-primary">Executive Overview</div>
                </div>
                <div className="h-1.5 bg-primary/20 rounded-full mb-3" />
                <div className="space-y-1.5">
                  <div className="h-2 bg-muted rounded-full w-full" />
                  <div className="h-2 bg-muted rounded-full w-5/6" />
                  <div className="h-2 bg-muted rounded-full w-4/5" />
                </div>
              </div>
            </div>
            <FileImage className="h-12 w-12 text-primary/50 absolute bottom-2 right-2" />
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">e-Box Executive Summary</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Concise two-page overview highlighting key business benefits, ROI statistics, 
                  and strategic advantages.
                </p>
              </div>
              
              <Badge variant="outline" className="shrink-0">
                PDF (1.5 MB)
              </Badge>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="p-4 bg-muted/20 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: July 2024
            </div>
            <Button variant="default" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download Summary
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
