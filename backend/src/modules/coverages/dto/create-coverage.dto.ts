import { IsOptional, IsString } from 'class-validator';

export class CreateCoverageDto {
  @IsString()
  name!: string;
}