import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { FilterSchedulesDto } from './dto/FiltersSchedulesDto';
import { UpdateProfessionalSchedulesDto } from './dto/update-professional-schedules.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @ApiOperation({ summary: 'Crear un horario individual' })
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @ApiOperation({ summary: 'Listar horarios con filtros y paginación' })
  @Get()
  findAll(@Query() filters: FilterSchedulesDto) {
    return this.schedulesService.findAll(filters);
  }

  @ApiOperation({ summary: 'Obtener un horario específico por su ID' })
  @Get(':id')
  findOne(@Param('id', PositiveIntPipe) id: number) {
    return this.schedulesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un horario individual' })
  @Put(':id')
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @ApiOperation({ summary: 'Eliminar un horario específico' })
  @Delete(':id')
  remove(@Param('id', PositiveIntPipe) id: number) {
    return this.schedulesService.remove(id);
  }

  // =========================================================================
  // NUEVO ENDPOINT MASIVO: Guarda o pisa la agenda completa de un médico
  // =========================================================================
  @ApiOperation({ summary: 'Reemplazar la grilla semanal completa de un profesional' })
  @Post('professional/:professionalId')
  replaceProfessionalSchedules(
    @Param('professionalId', PositiveIntPipe) professionalId: number,
    @Body() dto: UpdateProfessionalSchedulesDto,
  ) {
    return this.schedulesService.replaceProfessionalSchedules(professionalId, dto);
  }
}
