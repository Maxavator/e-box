
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type LoginMethod = 'email' | 'saId';

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saId, setSaId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const navigate = useNavigate();

  const validateSaId = (id: string) => {
    return /^\d{13}$/.test(id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
    } else {
      if (!saId) {
        toast.error("Please enter your SA ID number");
        return;
      }
      if (!validateSaId(saId)) {
        toast.error("Please enter a valid 13-digit SA ID number");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (loginMethod === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.session) {
          toast.success("Login successful!");
          navigate("/admin");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: `${saId}@said.auth`,
          password: saId,
        });

        if (error) throw error;
        if (data.session) {
          toast.success("Login successful!");
          navigate("/admin");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (loginMethod === 'email') {
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
    } else {
      if (!saId) {
        toast.error("Please enter your SA ID number");
        return;
      }
      if (!validateSaId(saId)) {
        toast.error("Please enter a valid 13-digit SA ID number");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (loginMethod === 'email') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          toast.success("Registration successful! Please check your email to confirm your account.");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: `${saId}@said.auth`,
          password: saId,
        });

        if (error) throw error;
        if (data.user) {
          toast.success("Registration successful with SA ID!");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    saId,
    setSaId,
    isLoading,
    loginMethod,
    setLoginMethod,
    handleLogin,
    handleSignUp,
  };
};
