
export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  is_favorite: boolean;
  created_at: string;
  contact: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    organization_id: string | null;
  };
}
