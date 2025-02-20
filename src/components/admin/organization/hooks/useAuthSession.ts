
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuthSession = () => {
  const { data: session, error } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth session error:', error);
          throw error;
        }
        return session;
      } catch (error) {
        console.error('Failed to get session:', error);
        return null;
      }
    },
  });

  return { session };
};
