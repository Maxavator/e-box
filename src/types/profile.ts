
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url?: string | null;
  organization_id: string | null;
  job_title?: string | null;
  sa_id?: string | null;
  province?: string | null;
  is_private?: boolean;
}

export interface UserProfileData {
  organizationName: string | null;
  organizationId: string | null;
  loading: boolean;
  error: Error | null;
  userDisplayName: string | null;
  userJobTitle: string | null;
  refreshProfile: () => Promise<void>;
  profile: Profile | null;
}

export interface ProfileQueryResult {
  profileData: Profile | null;
  orgName: string | null;
  jobTitle: string | null;
}
