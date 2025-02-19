
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { LoginMethod } from "@/hooks/useAuth";

interface LoginMethodSelectorProps {
  loginMethod: LoginMethod;
  onMethodChange: (method: LoginMethod) => void;
}

export const LoginMethodSelector = ({ loginMethod, onMethodChange }: LoginMethodSelectorProps) => {
  return (
    <div className="mb-4 flex gap-2">
      <Button
        type="button"
        variant={loginMethod === 'email' ? "default" : "outline"}
        className="w-1/2"
        onClick={() => onMethodChange('email')}
      >
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
      <Button
        type="button"
        variant={loginMethod === 'saId' ? "default" : "outline"}
        className="w-1/2"
        onClick={() => onMethodChange('saId')}
      >
        <Mail className="w-4 h-4 mr-2" />
        SA ID
      </Button>
    </div>
  );
};
