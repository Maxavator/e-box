
import type { Profile, UserRole, Organization } from "@/types/supabase-types";

export type { Profile, UserRole, Organization };

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
