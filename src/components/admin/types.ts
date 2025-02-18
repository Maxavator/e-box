
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];

export interface UserWithRole extends Profile {
  user_roles: Pick<UserRole, 'role'>[];
  organizations: Organization[];
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}
