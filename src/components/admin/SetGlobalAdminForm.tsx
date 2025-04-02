
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setUserAsGlobalAdmin } from "@/utils/admin/setUserAsGlobalAdmin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";

export function SetGlobalAdminForm() {
  const [saId, setSaId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saId.trim()) return;
    
    setIsLoading(true);
    try {
      await setUserAsGlobalAdmin(saId.trim());
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Set Global Admin
        </CardTitle>
        <CardDescription>
          Promote a user to Global Admin status by their SA ID number
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="sa-id" className="text-sm font-medium mb-1 block">
                South African ID Number
              </label>
              <Input
                id="sa-id"
                value={saId}
                onChange={(e) => setSaId(e.target.value)}
                placeholder="Enter SA ID (e.g., 7810205441087)"
                className="w-full"
                maxLength={13}
                minLength={13}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={saId.length !== 13 || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Admin...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Set as Global Admin
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
