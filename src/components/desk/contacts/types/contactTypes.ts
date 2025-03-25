
export type ContactType = 'personal' | 'business' | 'retailer';
export type ContactStatus = 'active' | 'pending' | 'invited';
export type ContactGroup = {
  id: string;
  name: string;
  description?: string;
  contacts: string[];
};

export type RetailPartner = {
  id: string;
  name: string;
  businessType: string;
  registrationNumber: string;
  isVerified: boolean;
};

export type ContactPerson = {
  id: string;
  contactId: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  saId?: string;
  type: ContactType;
  status: ContactStatus;
  groups: string[];
  retailers: string[];
  isStakeholder: boolean;
};
