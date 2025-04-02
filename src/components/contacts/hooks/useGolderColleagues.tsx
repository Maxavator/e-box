
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGolderColleagues = () => {
  return useQuery({
    queryKey: ['golder-colleagues'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      // This is just a demo example - you would typically fetch colleagues from your database
      // For now, we'll return a static list of Golder colleagues
      return [
        {
          id: "golder-1",
          first_name: "Sarah",
          last_name: "Johnson",
          avatar_url: "https://i.pravatar.cc/150?u=sarah",
          job_title: "Environmental Engineer"
        },
        {
          id: "golder-2",
          first_name: "David",
          last_name: "Thompson",
          avatar_url: "https://i.pravatar.cc/150?u=david",
          job_title: "Geotechnical Specialist"
        },
        {
          id: "golder-3",
          first_name: "Michael",
          last_name: "Chen",
          avatar_url: "https://i.pravatar.cc/150?u=michael",
          job_title: "Project Manager"
        }
      ];
    }
  });
};
