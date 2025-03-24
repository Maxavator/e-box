
export interface OrganizationFormData {
  name: string;
  domain: string;
  logo_url?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
  is_public?: boolean;
  created_by?: string;
}
