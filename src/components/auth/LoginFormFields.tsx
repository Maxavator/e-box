
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      </div>
    </>
  );
};
