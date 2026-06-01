import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoveragesService } from './coverages.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';

@Controller('coverages')
export class CoveragesController {
  constructor(private readonly coveragesService: CoveragesService) {}

  @Post()
  create(@Body() createCoverageDto: CreateCoverageDto) {
    return this.coveragesService.create(createCoverageDto);
  }

  @Get()
  findAll() {
    return this.coveragesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coveragesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoverageDto: UpdateCoverageDto) {
    return this.coveragesService.update(+id, updateCoverageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coveragesService.remove(+id);
  }
}
