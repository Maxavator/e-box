
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEST_ACCOUNTS } from "@/constants/auth";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <Label htmlFor="email">Email or SA ID Number</Label>
        <Input
          id="email"
          type="text"
          placeholder="Enter your email or SA ID number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full focus:ring-primary"
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          For testing, use ID: {TEST_ACCOUNTS.GLOBAL_ADMIN} (admin) or {TEST_ACCOUNTS.REGULAR} (user)
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full focus:ring-primary"
          autoComplete="current-password"
        />
        <p className="text-xs text-muted-foreground">
          For test accounts, use: password123
        </p>
      </div>

      <Alert variant="info" className="mt-4 bg-primary/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Test credentials:<br />
          - Admin: {TEST_ACCOUNTS.GLOBAL_ADMIN} / password123<br />
          - Regular user: {TEST_ACCOUNTS.REGULAR} / password123
        </AlertDescription>
      </Alert>
    </>
  );
};
