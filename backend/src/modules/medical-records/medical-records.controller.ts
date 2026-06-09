import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { FilterMedicalRecordsDto } from './dto/filter-medical-records.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Medical Records')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL)
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL) 
  findAll(@Query() filters: FilterMedicalRecordsDto) {
    return this.medicalRecordsService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL)
  findOne(@Param('id', PositiveIntPipe) id: number) {
    return this.medicalRecordsService.findOne(id);
  }
}
