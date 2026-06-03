import { UserRole } from '@prisma/client';

export interface JwtPayload {
  userId: number;
  dni: string;
  role: UserRole;
}