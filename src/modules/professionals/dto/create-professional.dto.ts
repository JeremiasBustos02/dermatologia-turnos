import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProfessionalDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsArray()
  specialtyIds!: number[];

  @IsArray()
  coverageIds!: number[];
}