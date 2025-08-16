import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Get()
  findAll(): Promise<Service[]> {
    return this.service.findAll();
  }

  
  @Post()
  create(@Body() data: Service): Promise<Service> {
    return this.service.create(data);
  }


  @Delete(':id')
  delete(@Param('id') id: string): Promise<Service> {
    return this.service.delete(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Service>): Promise<Service> {
    return this.service.update(+id, data);
  }
}
