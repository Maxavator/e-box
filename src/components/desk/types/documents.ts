
export interface Document {
  name: string;
  date: string;
  size: string;
  isVerified?: boolean;
  downloadUrl?: string;
  description?: string;
  previewContent?: string;
  category?: string;
  version?: string;
  lastModifiedBy?: string;
}
