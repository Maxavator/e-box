
import type { Profile, UserRole, Organization } from "@/types/supabase-types";

export type { Profile, UserRole, Organization };

export interface UserWithRole extends Profile {
  user_roles: UserRole[];
  organizations: Pick<Organization, 'name'>[];
  user_statistics?: {
    login_count: number;
    action_count: number;
    last_login: string | null;
  };
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole['role'];
  organizationId: string;
}

export interface OrganizationMetrics {
  id: string;
  organization_id: string;
  total_users: number;
  active_users: number;
  total_documents: number;
  storage_used: number;
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  id: string;
  user_id: string;
  last_login: string | null;
  login_count: number;
  action_count: number;
  created_at: string;
  updated_at: string;
}
