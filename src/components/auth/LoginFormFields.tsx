
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateSaId } from "@/utils/saIdValidation";
import { useState } from "react";

interface LoginFormFieldsProps {
  saId: string;
  setSaId: (saId: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const LoginFormFields = ({
  saId,
  setSaId,
  password,
  setPassword,
}: LoginFormFieldsProps) => {
  const [saIdError, setSaIdError] = useState<string | null>(null);

  const handleSaIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits to be entered
    if (value === '' || /^\d+$/.test(value)) {
      setSaId(value);
      const validation = validateSaId(value);
      setSaIdError(validation.isValid ? null : validation.message);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="saId">SA ID Number</Label>
        <Input
          id="saId"
          type="text"
          placeholder="Enter your 13-digit SA ID number"
          value={saId}
          onChange={handleSaIdChange}
          className="w-full focus:ring-primary"
          autoComplete="off"
          maxLength={13}
        />
        {saIdError && (
          <p className="text-xs text-red-500 mt-1">{saIdError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Example: 8801015800082
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
          Default: StaffPass123!
        </p>
      </div>
    </>
  );
};
