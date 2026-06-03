import { IsOptional, IsString } from 'class-validator';

export class FilterCoveragesDto {
  @IsOptional()
  @IsString()
  name?: string;
}