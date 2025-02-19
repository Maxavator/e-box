import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

interface LoginFormProps {
  onRequestDemo: () => void;
}

type Profile = Database['public']['Tables']['profiles']['Row'];

const LoginForm = ({ onRequestDemo }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saId, setSaId] = useState("");
  const [saIdPassword, setSaIdPassword] = useState("");
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const createTestUsers = async () => {
    if (isCreatingUsers) return;
    setIsCreatingUsers(true);

    try {
      // Create a test organization first
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: 'Test Organization', domain: 'test.org' }])
        .select()
        .single();

      if (orgError) throw orgError;

      // Create test users with their roles
      const users = [
        { email: '6010203040512', password: 'Test6010203040512', role: 'staff', saId: '6010203040512' },
        { email: '5010203040512', password: 'Test5010203040512', role: 'org_admin', saId: '5010203040512' },
        { email: '4010203040512', password: 'Test4010203040512', role: 'global_admin', saId: '4010203040512' }
      ];

      for (const user of users) {
        // Create user in auth system
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              first_name: user.role === 'staff' ? 'Regular' : user.role === 'org_admin' ? 'Org' : 'Global',
              last_name: user.role === 'staff' ? 'User' : 'Admin'
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Update profile with SA ID and organization
          await supabase
            .from('profiles')
            .update({ 
              sa_id: user.saId,
              organization_id: orgData.id 
            })
            .eq('id', authData.user.id);

          // Insert user role (changed from update to insert)
          await supabase
            .from('user_roles')
            .insert({ 
              user_id: authData.user.id,
              role: user.role 
            });
        }
      }

      toast({
        title: "Test Users Created",
        description: "All test users have been created successfully.",
      });
    } catch (error) {
      console.error('Error creating test users:', error);
      toast({
        title: "Error Creating Users",
        description: "Failed to create test users. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingUsers(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Invalid Credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

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

      handleSuccessfulLogin(data);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSaIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!saId || !saIdPassword) {
      toast({
        title: "Invalid Credentials",
        description: "Please enter both SA ID Number and password",
        variant: "destructive",
      });
      return;
    }

    // Validate SA ID format
    if (!/^\d{13}$/.test(saId)) {
      toast({
        title: "Invalid SA ID",
        description: "Please enter a valid 13-digit SA ID Number",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, get the email associated with the SA ID
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

      // Then sign in with the associated user credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.id,
        password: saIdPassword,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      handleSuccessfulLogin(data);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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

  return (
    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col items-center justify-center bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm">
      <Card className="w-full max-w-md animate-fadeIn shadow-xl hover:shadow-2xl transition-shadow duration-300 border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Welcome to e-Box
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="said">SA ID Number</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full focus:ring-primary"
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
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                >
                  Login with Email
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="said">
              <form onSubmit={handleSaIdLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="saId">SA ID Number</Label>
                  <Input
                    id="saId"
                    type="text"
                    placeholder="Enter your SA ID Number"
                    value={saId}
                    onChange={(e) => setSaId(e.target.value.replace(/\D/g, '').slice(0, 13))}
                    className="w-full focus:ring-primary"
                    maxLength={13}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saIdPassword">Password</Label>
                  <Input
                    id="saIdPassword"
                    type="password"
                    placeholder="Enter your password"
                    value={saIdPassword}
                    onChange={(e) => setSaIdPassword(e.target.value)}
                    className="w-full focus:ring-primary"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                >
                  Login with SA ID
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <Button
              type="button"
              onClick={createTestUsers}
              disabled={isCreatingUsers}
              variant="outline"
              className="w-full"
            >
              {isCreatingUsers ? 'Creating Test Users...' : 'Create Test Users'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <div className="text-center w-full">
            <button
              type="button"
              onClick={onRequestDemo}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Request a Demo
            </button>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-4">
        <span className="text-xs text-gray-500">
          Version 1.92
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
