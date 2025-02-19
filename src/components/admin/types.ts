
import type { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables']

export type Profile = Tables['profiles']['Row'];
export type UserRole = Tables['user_roles']['Row'];
export type Organization = Tables['organizations']['Row'];

export interface UserWithRole extends Profile {
  user_roles: UserRole[];
  organizations: Pick<Organization, 'name'>[];
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole['role'];
  organizationId: string;
}
