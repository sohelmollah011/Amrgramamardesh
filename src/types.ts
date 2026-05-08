import { Timestamp } from 'firebase/firestore';

export type MemberStatus = 'pending' | 'active' | 'suspended';
export type MemberRole = 'member' | 'admin';

export interface Address {
  village: string;
  postOffice: string;
  union: string;
  upazila: string;
  district: string;
}

export interface Member {
  uid: string;
  memberId?: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  address: Address;
  profession: string;
  documentUrl?: string;
  status: MemberStatus;
  role: MemberRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Saving {
  id: string;
  memberId: string;
  amount: number;
  type: 'weekly' | 'monthly';
  date: Timestamp;
  collectedBy: string;
  createdAt: Timestamp;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  postedBy: string;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Timestamp;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
