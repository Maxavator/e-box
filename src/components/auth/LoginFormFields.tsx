
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const LoginFormFields = ({
  email,
  setEmail,
  password,
  setPassword,
}: LoginFormFieldsProps) => {
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
};
