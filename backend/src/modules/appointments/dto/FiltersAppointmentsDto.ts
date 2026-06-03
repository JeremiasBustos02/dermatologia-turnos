import { IsOptional, IsString, IsNumber } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FiltersAppointmentsDto extends PaginationDto {
    @IsOptional()
    @IsNumber()
    patientId?: number;

    @IsOptional()
    @IsNumber()
    professionalId?: number;

    @IsOptional()
    @IsNumber()
    coverageId?: number;

    @IsOptional()
    @IsString()
    dateTime?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}