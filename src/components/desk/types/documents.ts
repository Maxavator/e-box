
export interface Document {
  id?: string;
  name: string;
  date?: string;
  size: string;
  isVerified?: boolean;
  downloadUrl?: string;
  description?: string;
  previewContent?: string;
  category?: string;
  version?: string;
  lastModifiedBy?: string;
  file_path?: string;
  content_type?: string;
  requires_otp?: boolean;
  created_at?: string;
  updated_at?: string;
}
