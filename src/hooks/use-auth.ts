
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthResponse } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast({
        title: "Invalid Credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      await handleSuccessfulLogin(data);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaIdLogin = async (saId: string, password: string) => {
    if (!saId || !password) {
      toast({
        title: "Invalid Credentials",
        description: "Please enter both SA ID Number and password",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{13}$/.test(saId)) {
      toast({
        title: "Invalid SA ID",
        description: "Please enter a valid 13-digit SA ID Number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('sa_id', saId)
        .single<Profile>();

      if (userError || !userData) {
        toast({
          title: "Login Failed",
          description: "Invalid SA ID Number",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.id,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      await handleSuccessfulLogin(data);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async (data: AuthResponse['data']) => {
    if (!data.user) return;
    
    // Check user role
    const { data: isAdmin } = await supabase.rpc('is_global_admin');
    
    if (isAdmin) {
      navigate("/admin");
    } else {
      // Check if user is an org admin
      const { data: userData, error: userError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (!userError && userData?.role === 'org_admin') {
        navigate("/organization");
      } else {
        navigate("/chat");
      }
    }

    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
  };

  return {
    isLoading,
    handleEmailLogin,
    handleSaIdLogin
  };
};
