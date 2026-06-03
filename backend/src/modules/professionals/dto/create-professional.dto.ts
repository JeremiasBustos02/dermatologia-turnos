import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalDto {
  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty()
  @IsArray()
  specialtyIds!: number[];

  @ApiProperty()
  @IsArray()
  coverageIds!: number[];
}