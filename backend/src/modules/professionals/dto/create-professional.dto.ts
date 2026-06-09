import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProfessionalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dni!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  specialtyIds!: number[];

  @ApiProperty()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  coverageIds!: number[];
}
