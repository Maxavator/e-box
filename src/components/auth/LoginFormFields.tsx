
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoginMethod } from "@/hooks/useAuth";

interface LoginFormFieldsProps {
  loginMethod: LoginMethod;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  saId: string;
  setSaId: (saId: string) => void;
}

export const LoginFormFields = ({
  loginMethod,
  email,
  setEmail,
  password,
  setPassword,
  saId,
  setSaId,
}: LoginFormFieldsProps) => {
  if (loginMethod === 'email') {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="email">Email or SA ID</Label>
          <Input
            id="email"
            type="text"
            placeholder="Enter your email or 13-digit SA ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Password must be at least 6 characters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full focus:ring-primary"
          />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="saId">SA ID Number</Label>
      <Input
        id="saId"
        type="text"
        placeholder="Enter your 13-digit SA ID"
        value={saId}
        onChange={(e) => setSaId(e.target.value)}
        className="w-full focus:ring-primary"
        maxLength={13}
      />
    </div>
  );
};
