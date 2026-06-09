import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  clinicName: string;

  @IsString()
  adminFirstName: string;

  @IsString()
  adminLastName: string;

  @IsString()
  adminDni: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6)
  adminPassword: string;
}
