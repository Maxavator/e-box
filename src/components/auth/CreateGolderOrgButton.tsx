
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGolderOrg } from "@/utils/createGolderOrg";
import { Loader2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function CreateGolderOrgButton() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateOrg = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    setIsDialogOpen(false);
    
    try {
      toast.info("Creating Golder organization and users...");
      await createGolderOrg();
    } catch (error: any) {
      console.error("Error creating Golder organization:", error);
      toast.error(`Failed to create organization: ${error.message || "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="w-full mt-4"
          >
            Create Golder Organization & Users
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Golder Organization</DialogTitle>
            <DialogDescription className="text-sm">
              This will create:
              <div className="mt-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-medium">Global Admin:</span> Max Dlamini (m@ramutla.com)</li>
                  <li><span className="font-medium">Organization:</span> Golder (Pty) Ltd.</li>
                  <li><span className="font-medium">10 Users:</span> Including 1 Org Admin and 9 Staff</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrg}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Now"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="outline"
        onClick={handleCreateOrg}
        disabled={isCreating}
        className="w-full mt-2"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Golder organization...
          </>
        ) : (
          "Create Golder Organization (Quick)"
        )}
      </Button>
    </>
  );
}
