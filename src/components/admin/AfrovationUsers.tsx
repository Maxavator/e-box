
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Check, AlertCircle } from "lucide-react";
import { afrovationUsers } from "@/utils/organization/afrovationUserDefinitions";
import { createOrganizationUsers } from "@/utils/organization/createOrganizationUsers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AfrovationUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{successCount: number, errorCount: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUsers = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // First, get the Afrovation organization ID
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', 'Afrovation Group (Pty) Ltd.')
        .single();
        
      if (orgError) {
        throw new Error(`Could not find Afrovation organization: ${orgError.message}`);
      }
      
      const orgId = orgData.id;
      
      // Create the users
      const results = await createOrganizationUsers(afrovationUsers, orgId);
      setResult(results);
      
      if (results.successCount > 0) {
        toast.success(`Successfully created ${results.successCount} users for Afrovation Group`);
      }
      
      if (results.errorCount > 0) {
        toast.warning(`Failed to create ${results.errorCount} users. Check console for details.`);
      }
    } catch (err) {
      console.error('Error creating Afrovation users:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Error creating Afrovation users');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Add Afrovation Group Users
        </CardTitle>
        <CardDescription>
          Create {afrovationUsers.length} users for Afrovation Group (Pty) Ltd.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && (
          <Alert className={result.errorCount === 0 ? "bg-green-50 border-green-200 mb-4" : "bg-yellow-50 border-yellow-200 mb-4"}>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>User Creation Results</AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Success: {result.successCount}
                  </Badge>
                  {result.errorCount > 0 && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Failed: {result.errorCount}
                    </Badge>
                  )}
                </div>
                {result.errorCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Check the console for error details.
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This will create user accounts for all Afrovation employees with appropriate roles and organization assignment.
          </p>
          <p className="text-sm font-semibold">
            Users to be created:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {afrovationUsers.slice(0, 6).map((user, index) => (
              <div key={index} className="text-xs p-2 border rounded">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-muted-foreground">{user.jobTitle}</div>
              </div>
            ))}
            {afrovationUsers.length > 6 && (
              <div className="text-xs p-2 border rounded bg-muted flex items-center justify-center">
                +{afrovationUsers.length - 6} more users
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateUsers} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Users...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Afrovation Users
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
