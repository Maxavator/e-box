
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useContactFavorites = () => {
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ contactId, isFavorite }: { contactId: string, isFavorite: boolean }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Check if contact exists
      const { data: existingContact } = await supabase
        .from('contacts')
        .select('id')
        .eq('user_id', userData.user.id)
        .eq('contact_id', contactId)
        .maybeSingle();

      if (existingContact) {
        // Update existing contact
        const { error } = await supabase
          .from('contacts')
          .update({ is_favorite: isFavorite })
          .eq('user_id', userData.user.id)
          .eq('contact_id', contactId);

        if (error) throw error;
      } else {
        // Create new contact with favorite status
        const { error } = await supabase
          .from('contacts')
          .insert([
            { user_id: userData.user.id, contact_id: contactId, is_favorite: isFavorite }
          ]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update contact: " + error.message);
    }
  });

  return { toggleFavoriteMutation };
};
