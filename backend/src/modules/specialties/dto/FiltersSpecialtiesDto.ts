import { IsOptional, IsString } from 'class-validator';

export class FiltersSpecialtiesDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}