import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateLineDto } from '../line/dto/create-line.dto';
import { UpdateLineDto } from '../line/dto/update-line.dto';
import { Line } from './entities/line.entity';
import { LineService } from './line.service';

@ApiTags('line')
@ApiBearerAuth()
@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post()
  async create(@Body() createLineDto: CreateLineDto): Promise<Line> {
    return this.lineService.create(createLineDto);
  }

  @Get()
  async getAll(): Promise<Line[]> {
    return this.lineService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Line> {
    return this.lineService.findOneByID(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLineDto: UpdateLineDto,
  ): Promise<Line> {
    return this.lineService.update(id, updateLineDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpStatus> {
    await this.lineService.remove(id);
    return HttpStatus.OK;
  }
}
