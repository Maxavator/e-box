
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

  const isSaId = (input: string) => {
    return /^\d+$/.test(input) && input.length === 13;
  };

  const formatSaIdPassword = (id: string) => {
    return `Test${id}`;
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
      let signInResult;
      
      if (loginMethod === 'email') {
        const loginEmail = isSaId(email) ? `${email}@said.auth` : email;
        const loginPassword = isSaId(email) ? formatSaIdPassword(email) : password;
        
        signInResult = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });
      } else {
        signInResult = await supabase.auth.signInWithPassword({
          email: `${saId}@said.auth`,
          password: formatSaIdPassword(saId),
        });
      }

      if (signInResult.error) {
        console.error('Login error details:', signInResult.error);
        if (signInResult.error.message.includes('Invalid login credentials')) {
          if (loginMethod === 'email') {
            if (isSaId(email)) {
              toast.error("Invalid SA ID or password. Remember: if using SA ID, the password format is 'Test' followed by your SA ID");
            } else {
              toast.error("Invalid email or password. Please try again.");
            }
          } else {
            toast.error("Invalid SA ID. Please try again or sign up if you haven't already.");
          }
        } else {
          toast.error(signInResult.error.message);
        }
        return;
      }

      if (signInResult.data.session) {
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "An unexpected error occurred");
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
      if (isSaId(email)) {
        toast.error("Please use the SA ID login method to register with an SA ID");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
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
      let signUpResult;
      
      if (loginMethod === 'email') {
        signUpResult = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        const saIdPassword = formatSaIdPassword(saId);
        signUpResult = await supabase.auth.signUp({
          email: `${saId}@said.auth`,
          password: saIdPassword,
          options: {
            data: {
              sa_id: saId,
            }
          }
        });
      }

      if (signUpResult.error) {
        if (signUpResult.error.message.includes('already registered')) {
          toast.error("This account already exists. Please try logging in instead.");
        } else {
          toast.error(signUpResult.error.message);
        }
        return;
      }

      if (signUpResult.data.user) {
        if (loginMethod === 'email') {
          toast.success("Registration successful! Please check your email to confirm your account.");
        } else {
          toast.success("Registration successful with SA ID!");
          // Attempt immediate login after SA ID registration
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: `${saId}@said.auth`,
            password: formatSaIdPassword(saId),
          });
          
          if (loginData.session) {
            navigate("/admin");
          }
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || "An unexpected error occurred");
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
