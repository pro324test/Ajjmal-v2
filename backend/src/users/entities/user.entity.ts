export class User {
  id: number;
  email?: string;
  phoneNumber: string;
  fullName: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<{
    role: string;
    isActive: boolean;
    isPrimary: boolean;
  }>;
}
