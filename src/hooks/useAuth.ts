
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Test accounts configuration
const TEST_ACCOUNTS = {
  REGULAR: "6010203040512",
  ORG_ADMIN: "5010203040512",
  GLOBAL_ADMIN: "4010203040512"
};

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isTestAccount = (id: string) => {
    return Object.values(TEST_ACCOUNTS).includes(id);
  };

  const validateSaId = (id: string) => {
    // Allow test accounts through even if they don't match the regular SA ID format
    if (isTestAccount(id)) return true;
    return /^\d{13}$/.test(id);
  };

  const isSaId = (input: string) => {
    if (isTestAccount(input)) return true;
    return /^\d+$/.test(input) && input.length === 13;
  };

  const formatSaIdPassword = (id: string) => {
    return `Test${id}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email/SA ID and password");
      return;
    }

    setIsLoading(true);
    try {
      let signInResult;
      
      // Handle test accounts and regular SA ID format
      if (isSaId(email)) {
        signInResult = await supabase.auth.signInWithPassword({
          email: `${email}@said.auth`,
          password: formatSaIdPassword(email),
        });
      } else {
        signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (signInResult.error) {
        console.error('Login error details:', signInResult.error);
        if (signInResult.error.message.includes('Invalid login credentials')) {
          if (isSaId(email)) {
            const isTest = isTestAccount(email);
            toast.error(isTest 
              ? `For test account ${email}, use password: Test${email}`
              : "Invalid SA ID number or password format incorrect"
            );
          } else {
            toast.error("Invalid email or password");
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
    if (!email || !password) {
      toast.error("Please enter both email/SA ID and password");
      return;
    }

    if (isSaId(email)) {
      if (!validateSaId(email)) {
        toast.error("Please enter a valid 13-digit SA ID number");
        return;
      }
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      let signUpResult;
      
      if (isSaId(email)) {
        const saIdPassword = formatSaIdPassword(email);
        signUpResult = await supabase.auth.signUp({
          email: `${email}@said.auth`,
          password: saIdPassword,
          options: {
            data: {
              sa_id: email,
            }
          }
        });
      } else {
        signUpResult = await supabase.auth.signUp({
          email,
          password,
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
        if (isSaId(email)) {
          toast.success("Registration successful with SA ID!");
          // Attempt immediate login after SA ID registration
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: `${email}@said.auth`,
            password: formatSaIdPassword(email),
          });
          
          if (loginData.session) {
            navigate("/admin");
          }
        } else {
          toast.success("Registration successful! Please check your email to confirm your account.");
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
    isLoading,
    handleLogin,
    handleSignUp,
  };
};
