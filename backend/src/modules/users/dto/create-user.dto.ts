import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
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
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @ValidateIf((dto) => dto.role !== UserRole.PATIENT || dto.password !== undefined)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  coverageId?: number | null;
}
