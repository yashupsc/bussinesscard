export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  bio: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
}

export interface BusinessCard {
  personalInfo: PersonalInfo;
  address: Address;
  socialAccounts: SocialAccount[];
}