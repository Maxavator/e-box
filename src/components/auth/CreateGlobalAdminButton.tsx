
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { createGlobalAdmin } from "@/utils/createGlobalAdmin";

export const CreateGlobalAdminButton = () => {
  return (
    <Button 
      variant="outline" 
      className="w-full mt-2" 
      onClick={createGlobalAdmin}
    >
      <Shield className="mr-2 h-4 w-4" />
      Create Global Admin
    </Button>
  );
};
