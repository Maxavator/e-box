
import React, { useEffect } from "react";
import { Documents } from "@/components/desk/Documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function MyDocuments() {
  const navigate = useNavigate();
  const { organizationName } = useUserProfile();
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            My Documents
            {organizationName && (
              <Badge variant="outline" className="ml-2">
                {organizationName}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access and manage your documents and files
          </p>
        </div>
      </div>
      
      <Documents />
    </div>
  );
}
