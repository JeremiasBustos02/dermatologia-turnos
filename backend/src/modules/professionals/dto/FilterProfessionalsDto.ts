import { IsOptional, IsString, IsArray} from 'class-validator';

export class FilterProfessionalsDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @IsOptional()
    @IsArray()
    specialtyIds?: number[];

    @IsOptional()
    @IsArray()
    coverageIds?: number[];
}