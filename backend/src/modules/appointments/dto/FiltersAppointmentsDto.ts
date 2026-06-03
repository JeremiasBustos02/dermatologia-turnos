import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FiltersAppointmentsDto {
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