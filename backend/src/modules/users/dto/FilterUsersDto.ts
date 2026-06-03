import { UserRole } from '@prisma/client';

export class FilterUsersDto {
  dni?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
}