
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGolderOrg } from "@/utils/createGolderOrg";
import { Loader2 } from "lucide-react";

export function CreateGolderOrgButton() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrg = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      await createGolderOrg();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      variant="outline"
      onClick={handleCreateOrg}
      disabled={isCreating}
      className="w-full mt-4"
    >
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Golder organization...
        </>
      ) : (
        "Create Golder Organization"
      )}
    </Button>
  );
}
