import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Contact } from "../types/contacts";

export const useContacts = () => {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('contacts')
        .select(`
          id,
          user_id,
          contact_id,
          is_favorite,
          created_at,
          contact:profiles (
            id,
            first_name,
            last_name,
            organization_id
          )
        `)
        .eq('user_id', userData.user.id);

      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        contact: item.contact || {
          id: item.contact_id,
          first_name: null,
          last_name: null,
          organization_id: null
        }
      })) as Contact[];
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ contactId, isFavorite }: { contactId: string, isFavorite: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('contacts')
        .update({ is_favorite: isFavorite })
        .eq('user_id', userData.user.id)
        .eq('contact_id', contactId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update contact: " + error.message);
    }
  });

  return {
    contacts,
    isLoading,
    toggleFavoriteMutation
  };
};
