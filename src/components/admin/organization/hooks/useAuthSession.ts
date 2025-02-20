
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuthSession = () => {
  const { data: session, error } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const maxRetries = 3;
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
              console.error('Auth session error:', error);
              if (error.message.includes('Database error querying schema') && retryCount < maxRetries - 1) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                continue;
              }
              throw error;
            }
            return session;
          } catch (error) {
            if (retryCount < maxRetries - 1) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              continue;
            }
            throw error;
          }
        }
        return null;
      } catch (error) {
        console.error('Failed to get session:', error);
        return null;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 5000),
  });

  return { session };
};
