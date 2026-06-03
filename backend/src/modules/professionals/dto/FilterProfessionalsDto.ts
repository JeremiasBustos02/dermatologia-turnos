import { IsOptional, IsString, IsArray} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterProfessionalsDto extends PaginationDto {
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